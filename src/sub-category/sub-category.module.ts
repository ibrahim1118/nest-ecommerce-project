import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import { SubCategory } from './entities/sub-category.entity';
import { CategoryService } from '../category/category.service';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategory]), CategoryModule],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
  exports: [SubCategoryService]
})
export class SubCategoryModule {}
