import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { CartModule } from '../cart/cart.module';
import { UserModule } from '../user/user.module';
import { TexModule } from '../tex/tex.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    CartModule,
    UserModule,
    TexModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
