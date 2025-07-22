import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { CouponModule } from '../coupon/coupon.module';
import { ProductCart } from './entities/productCart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, ProductCart]), UserModule, ProductModule, CouponModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService]
})
export class CartModule {}
