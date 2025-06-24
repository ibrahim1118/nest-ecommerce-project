import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';
import { ProductCart } from './entities/productCart.entity';
import { UpdateCartQuantityDto } from './dto/update.car.quantity.dto';
import { CouponService } from 'src/coupon/coupon.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(ProductCart)
    private productCartRepository: Repository<ProductCart>,
    private userService: UserService,
    private productService: ProductService,
    private couponService: CouponService
  ) {}

  async addToCart(createCartDto: CreateCartDto, userId: string) {
    try {
      // Get user
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Get products
      const products = await Promise.all(
        createCartDto.productIds.map(id => this.productService.findOne(id))
      );
      
      // Filter out any null products
      const validProducts = products.filter(product => product !== null && product.quantity > 0);
      
      if (validProducts.length !== createCartDto.productIds.length) {
        throw new BadRequestException('One or more products are invalid or out of stock');
      }
  
      // Check if user already has a cart
      let cart = await this.cartRepository.findOne({
        where: { userId },
        relations: ['products', 'products.product', 'user']
      });

      if (cart) {
        // If cart exists, add new products to existing cart
        for (const product of validProducts) {
          // Check if product already exists in cart
          const existingProductCart = cart.products.find(pc => pc.product.id === product.id);
          
          if (existingProductCart) {
            // Update quantity if product exists
            existingProductCart.quantity = existingProductCart.quantity + 1;
            await this.productCartRepository.save(existingProductCart);
          } else {
            // Create new product-cart relationship if product doesn't exist
            const productCart = this.productCartRepository.create({
              cart,
              product,
              quantity: 1,
              price: product.price,
              priceAfterDiscount: product.priceAfterDiscount
            });
            cart.products.push(await this.productCartRepository.save(productCart));
          }
        }
        
        // Recalculate totals
        cart.totalprice = cart.products.reduce((sum, pc) => 
          sum + (Number(pc.price) * pc.quantity), 0);
        cart.totalPriceAfterDiscount = cart.products.reduce((sum, pc) => 
          sum + (Number(pc.priceAfterDiscount) * pc.quantity), 0);
        
        return await this.cartRepository.save(cart);
      }

      // Create new cart
      cart = this.cartRepository.create({
        user,
        userId,
        totalprice: 0,
        totalPriceAfterDiscount: 0,
        products: []
      });
      
      // Save cart first
      cart = await this.cartRepository.save(cart);
      
      // Create product-cart relationships
      for (const product of validProducts) {
        const productCart = this.productCartRepository.create({
          cart,
          product,
          quantity: 1,
          price: product.price,
          priceAfterDiscount: product.priceAfterDiscount
        });
        cart.products.push(await this.productCartRepository.save(productCart));
      }

      // Calculate final totals
      cart.totalprice = cart.products.reduce((sum, pc) => 
        sum + (Number(pc.price) * pc.quantity), 0);
      cart.totalPriceAfterDiscount = cart.products.reduce((sum, pc) => 
        sum + (Number(pc.priceAfterDiscount) * pc.quantity), 0);

      return await this.cartRepository.save(cart);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error in addToCart:', error);
      throw new BadRequestException('Failed to add items to cart');
    }
  }


  async updateQuantityCart(updateCartDto: UpdateCartQuantityDto, userId: string) {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['products', 'products.product', 'user']
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    const productCart = cart.products.find(pc => pc.product.id === updateCartDto.productId);
    if (!productCart) {
      throw new NotFoundException('Product not found in cart');
    }
    if (updateCartDto.opertion === 'increment'&& productCart.quantity < productCart.product.quantity) {
      productCart.quantity++;
    } else if (updateCartDto.opertion === 'decrement'&& productCart.quantity > 1) {
      productCart.quantity--;
    }
    return await this.productCartRepository.save(productCart);
  }

  async findAll() {
    return await this.cartRepository.find({
      relations: ['products', 'products.product', 'user']
    });
  }

  async updateCart(updateCartDto: UpdateCartDto, userId: string) {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['products', 'products.product', 'user']
    });
    
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    if (updateCartDto.productIds && updateCartDto.productIds.length > 0) {
      // Remove products that match the IDs in updateCartDto.productIds
      const productsToRemove = cart.products.filter(productCart => 
        updateCartDto.productIds!.includes(productCart.product.id)
      );

      // Delete the product-cart relationships
      await Promise.all(productsToRemove.map(pc => 
        this.productCartRepository.delete(pc.id)
      ));

      // Update the cart's products array
      cart.products = cart.products.filter(productCart => 
        !updateCartDto.productIds!.includes(productCart.product.id)
      );
      
      // Recalculate totals
      cart.totalprice = cart.products.reduce((sum, pc) => 
        sum + (Number(pc.price) * pc.quantity), 0);
      cart.totalPriceAfterDiscount = cart.products.reduce((sum, pc) => 
        sum + (Number(pc.priceAfterDiscount) * pc.quantity), 0);
    }

    return await this.cartRepository.save(cart);
  }

  async findOne(id: number) {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['products', 'products.product', 'user']
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    return cart;
  }


  async userCart(userId: string) {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['products', 'products.product', 'user']
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }
  async remove(id: number) {
    try {
      const result = await this.cartRepository.delete(id);
      
      if (result.affected === 0) {
        throw new NotFoundException(`Cart with ID ${id} not found`);
      }

      return { message: 'Cart deleted successfully' };
    } catch (error) {
      console.error('Error in remove:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete cart');
    }
  }

  async addCoupon(couponId: number, userId: string) {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['coupons']
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    const coupon = await this.couponService.findOne(couponId);
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    
    if (coupon.expiryDate < new Date()) {
      throw new BadRequestException('Coupon expired');
    }
    console.log(cart.coupons);
    if (cart.coupons.some(c => c.id === couponId)) {
      throw new BadRequestException('Coupon already added');
    }
    if (cart.totalPriceAfterDiscount < coupon.discount) {
      throw new BadRequestException('Coupon discount is greater than cart total price after discount');
    }
    cart.totalPriceAfterDiscount = cart.totalPriceAfterDiscount - coupon.discount;
    cart.coupons.push(coupon);
    return await this.cartRepository.save(cart);
  }
}
