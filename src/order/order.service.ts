import { Injectable, NotFoundException, InternalServerErrorException, Logger, BadRequestException, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CartService } from '../cart/cart.service';
import { UserService } from '../user/user.service';
import { TexService } from '../tex/tex.service';
import { OrderStatus } from './enums/order-status.enum';
import Stripe from 'stripe';
import { UpdateCartClearDto } from '../cart/dto/update-cart-clear.dto';

@Injectable()
export class OrderService implements OnModuleInit {
  private readonly logger = new Logger(OrderService.name);
  private stripe: Stripe;

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private cartService: CartService,
    private userService: UserService,
    private texService: TexService,
  ) {}

  onModuleInit() {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      this.logger.error('Stripe secret key is not configured!');
      throw new Error('STRIPE_SECRET_KEY must be provided in environment variables');
    }
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2025-05-28.basil' // Latest supported version
    });
  }

  async create(createOrderDto: CreateOrderDto, userId: string) {
    try {
      // Get user first
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Get cart
      const cart = await this.cartService.userCart(userId)
      if (!cart) {
        throw new NotFoundException('user don\'t have a cart');
      }
      if (!cart.products || cart.products.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      // Get tax
      const taxes = await this.texService.findAll();
      if (!taxes || taxes.length === 0) {
        throw new NotFoundException('Tax configuration not found');
      }
      const tax = taxes[0];

      // Create order
      const order = this.orderRepository.create({
        cart,
        cartId: cart.id,
        user,
        userId: user.id,
        totalPrice: cart.totalprice + tax.shippingPrice + tax.texPrice || 0,
        totalPriceAfterDiscount: cart.totalPriceAfterDiscount || 0,
        shippingPrice: tax.shippingPrice || 0,
        shippingAddress: createOrderDto.shippingAddress,
        paymentMethod: createOrderDto.paymentMethod,
        isPaid: false,
        isShipped: false,
        isDelivered: false,
        status: OrderStatus.PENDING
      });

      // Save the order first to get the ID
      const savedOrder = await this.orderRepository.save(order);

      // Create line items for Stripe with proper error handling
      const line_items = cart.products.map(cartProduct => {
        if (!cartProduct || !cartProduct.product) {
          throw new BadRequestException('Invalid product in cart');
        }

        const product = cartProduct.product;
        const price = product.price || 0;
        
        return {
          price_data: {
            currency: 'egp',
            product_data: {
              name: product.name || 'Unnamed Product',
              description: product.description || undefined,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: cartProduct.quantity || 1,
        };
      });

      // Create Stripe checkout session
      const session = await this.stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/order/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/order/cancel`,
        metadata: {
          orderId: savedOrder.id,
          userId: user.id,
          cartId: cart.id.toString(),
          email: user.email
        }
      });

      await this.cartService.clearCart(cart.id);

      return {
        status: 'success',
        message: 'Order created successfully',
        data: {
          sessionId: session.id,
          sessionUrl: session.url,
          orderId: savedOrder.id,
          userId: user.id,
          cartId: cart.id.toString(),
          email: user.email,
          totalPrice: cart.totalprice + tax.shippingPrice + tax.texPrice || 0,
          totalPriceAfterDiscount: cart.totalPriceAfterDiscount || 0,
          shippingPrice: tax.shippingPrice || 0,
          shippingAddress: createOrderDto.shippingAddress,
          paymentMethod: createOrderDto.paymentMethod,
          isPaid: false,
        }
      };
    } catch (error) {
      this.logger.error('Error creating order:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to create order: ${error.message}`);
    }
  }

  async findAll() {
    return this.orderRepository.find({
      relations: ['user', 'cart', 'cart.products', 'cart.products.product']
    });
  }

  async findAllByUserId(userId: string) {
    return this.orderRepository.find({
      where: { userId },
      relations: ['user', 'cart', 'cart.products', 'cart.products.product']
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'cart', 'cart.products', 'cart.products.product']
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return this.orderRepository.save(order);
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    return this.orderRepository.remove(order);
  }
}
