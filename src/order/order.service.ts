import { Injectable, NotFoundException, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CartService } from '../cart/cart.service';
import { UserService } from '../user/user.service';
import { TexService } from '../tex/tex.service';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private cartService: CartService,
    private userService: UserService,
    private texService: TexService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    try {
      this.logger.debug(`Creating order for user ${userId}`);
      
      // Get user first
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      this.logger.debug(`Found user ${user.email}`);

      // Get cart
      let cart;
      try {
        cart = await this.cartService.userCart(userId);
      } catch (error) {
        throw new BadRequestException('Please add items to your cart before creating an order');
      }

      if (!cart.products || cart.products.length === 0) {
        throw new BadRequestException('Cart is empty');
      }
      this.logger.debug(`Found cart with ID ${cart.id} and ${cart.products.length} products`);

      // Get tax
      const taxes = await this.texService.findAll();
      if (!taxes || taxes.length === 0) {
        throw new NotFoundException('Tax configuration not found');
      }
      const tax = taxes[0];
      this.logger.debug(`Applied tax configuration with shipping price ${tax.shippingPrice}`);

      // Create order
      const order = this.orderRepository.create({
        cart,
        cartId: cart.id,
        user,
        userId: user.id,
        totalPrice: cart.totalprice+ tax.shippingPrice + tax.texPrice || 0,
        totalPriceAfterDiscount: cart.totalPriceAfterDiscount || 0,
        shippingPrice: tax.shippingPrice || 0,
        shippingAddress: createOrderDto.shippingAddress,
        paymentMethod: createOrderDto.paymentMethod,
        isPaid: false,
        isShipped: false,
        isDelivered: false,
        status: OrderStatus.PENDING
      });

      this.logger.debug('Order entity created, attempting to save');
      const savedOrder = await this.orderRepository.save(order)
      this.logger.debug(`Order saved successfully with ID ${savedOrder.id}`);

      return savedOrder;
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
