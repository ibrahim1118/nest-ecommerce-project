import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { Review } from './entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), ProductModule, UserModule],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule {}
