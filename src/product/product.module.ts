import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { BrandModule } from '../brand/brand.module';
import { SubCategoryModule } from '../sub-category/sub-category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    BrandModule,
    SubCategoryModule
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
