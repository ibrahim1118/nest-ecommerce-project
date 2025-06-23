import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { ProductCart } from './entities/productCart.entity';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { CouponModule } from 'src/coupon/coupon.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, ProductCart]),
    UserModule,
    ProductModule,
    CouponModule
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
