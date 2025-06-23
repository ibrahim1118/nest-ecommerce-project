import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestProduct } from './entities/request-product.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RequestProductService {
  constructor(  
    @InjectRepository(RequestProduct)
    private requestProductRepository: Repository<RequestProduct>,
    private userService: UserService,
  ) {}

  async create(createRequestProductDto: CreateRequestProductDto, userId: string) {
    try {
      // Find the user
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      // Create the request product
      const requestProduct = this.requestProductRepository.create({
        ...createRequestProductDto,
        userId: user.id,
        user: user
      });

      // Save and return the request product
      return await this.requestProductRepository.save(requestProduct);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create request product: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.requestProductRepository.find({
        relations: ['user']
      });
    } catch (error) {
      throw new BadRequestException(`Failed to fetch request products: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const requestProduct = await this.requestProductRepository.findOne({
        where: { id },
        relations: ['user']
      });

      if (!requestProduct) {
        throw new NotFoundException(`Request product with ID ${id} not found`);
      }

      return requestProduct;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to fetch request product: ${error.message}`);
    }
  }

  async update(id: number, updateRequestProductDto: UpdateRequestProductDto) {
    try {
      const requestProduct = await this.findOne(id);
      
      Object.assign(requestProduct, updateRequestProductDto);
      
      return await this.requestProductRepository.save(requestProduct);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update request product: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const requestProduct = await this.findOne(id);
      
      await this.requestProductRepository.remove(requestProduct);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete request product: ${error.message}`);
    }
  }
}
