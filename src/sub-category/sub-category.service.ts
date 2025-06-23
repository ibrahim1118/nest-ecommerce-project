import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { SubCategory } from './entities/sub-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class SubCategoryService {

  constructor(
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
    private categoryService: CategoryService,
  ) {}

  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const category = await this.categoryService.findOne(createSubCategoryDto.categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const subCategory = await this.subCategoryRepository.findOne({ 
      where: { 
        name: createSubCategoryDto.name,
        categoryId: createSubCategoryDto.categoryId
      } 
    });

    if (subCategory) {
      throw new BadRequestException('SubCategory already exists in this category');
    }

    const newSubCategory = this.subCategoryRepository.create({
      name: createSubCategoryDto.name,
      categoryId: category.id,
      category: category
    });

    return this.subCategoryRepository.save(newSubCategory);
  }

  async findAll() {
    return await this.subCategoryRepository.find({
      relations: ['category']
    });
  }

  async findOne(id: number) {
    const subCategory = await this.subCategoryRepository.findOne({ 
      where: { id },
      relations: ['category']
    });
    if (!subCategory) {
      throw new NotFoundException('SubCategory not found');
    }
    return subCategory;
  }

  async update(id: number, updateSubCategoryDto: UpdateSubCategoryDto) {
    const subCategory = await this.findOne(id);
    
    if (updateSubCategoryDto.categoryId) {
      const category = await this.categoryService.findOne(updateSubCategoryDto.categoryId);
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      subCategory.category = category;
    }
    
    if (updateSubCategoryDto.name) {
      subCategory.name = updateSubCategoryDto.name;
    }

    return this.subCategoryRepository.save(subCategory);
  }

  async remove(id: number) {
    const subCategory = await this.findOne(id);
    return this.subCategoryRepository.remove(subCategory);
  }

  async findByCategoryId(categoryId: number) {
    // First verify the category exists
    await this.categoryService.findOne(categoryId);

    return await this.subCategoryRepository.find({ 
      where: { categoryId },
      relations: ['category']
    });
  }
}
