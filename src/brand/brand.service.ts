import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BrandService {

  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto) {
    try {
      const {name} = createBrandDto;
      
      // Check if brand already exists
      const existingBrand = await this.brandRepository.findOne({where: {name}});
      if(existingBrand){
        throw new BadRequestException("Brand already exists");
      }

      // Create and save the new brand
      const brand = this.brandRepository.create(createBrandDto);
      return await this.brandRepository.save(brand);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Failed to create brand: ${error.message}`);
    }
  }

  async findAll() {
    return await this.brandRepository.find();
  }

  async findOne(id: number) {
   const brand = await this.brandRepository.findOne({where: {id}});
   if(!brand){
    throw new NotFoundException("Brand not found");
   }
   return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    const {name, image} = updateBrandDto;
    const brand = await this.brandRepository.findOne({where: {id}});
    if(!brand){
      throw new NotFoundException("Brand not found");
    }
    brand.name = name || brand.name;
    brand.image = image || brand.image;
    return this.brandRepository.save(brand);
  }

  async remove(id: number) {
    const brand = await this.brandRepository.findOne({where: {id}});
    if(!brand){
      throw new NotFoundException("Brand not found");
    }
    return this.brandRepository.delete(id);
  }
}
