import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { SubCategoryService } from 'src/sub-category/sub-category.service';
import { BrandService } from 'src/brand/brand.service';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private subCategoryService: SubCategoryService,
    private brandService: BrandService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const subCategory = await this.subCategoryService.findOne(createProductDto.subCategoryId);
    if(!subCategory){
      throw new NotFoundException("SubCategory not found");
    }
    const brand = await this.brandService.findOne(createProductDto.brandId);
    if(!brand){
      throw new NotFoundException("Brand not found");
    }
    const product = this.productRepository.create(createProductDto);
    product.subCategory = subCategory;
    product.brand = brand;
    return this.productRepository.save(product);
  }

  async findAll(query: any) {
    const {page=1, limit=10, search, sort = "ASC", minPrice, maxPrice , subCategoryId, brandId} = query;
    if (sort !== "ASC" && sort !== "DESC"){
      throw new BadRequestException("Invalid sort order");
    }
    if(page < 1){
      throw new BadRequestException("Page must be greater than 0");
    }
    if(limit < 1){
      throw new BadRequestException("Limit must be greater than 0");
    }
    const queryBuilder = this.productRepository.createQueryBuilder("product");
    if(search){
      queryBuilder.where("product.name LIKE :search", {search: `%${search}%`});
    }
    if(minPrice){
      queryBuilder.andWhere("product.price >= :minPrice", {minPrice});
    }
    if(maxPrice){
      queryBuilder.andWhere("product.price <= :maxPrice", {maxPrice});
    }
    if(subCategoryId){
      queryBuilder.andWhere("product.subCategoryId = :subCategoryId", {subCategoryId});
    }
    if(brandId){
      queryBuilder.andWhere("product.brandId = :brandId", {brandId});
    }
    if(sort){
      queryBuilder.orderBy("product.price", sort);
    }
    const [products, total] = await queryBuilder.skip((page - 1) * limit).take(limit).getManyAndCount();
    return {products, total};
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({where: {id}, relations: ["subCategory", "brand"]});
    if(!product){
      throw new NotFoundException("Product not found");
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({where: {id}, relations: ["subCategory", "brand"]});
    if(!product){
      throw new NotFoundException("Product not found");
    }
    return this.productRepository.update(id, updateProductDto);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({where: {id}, relations: ["subCategory", "brand"]});
    if(!product){
      throw new NotFoundException("Product not found");
    }
    return this.productRepository.delete(id);
  }
}
