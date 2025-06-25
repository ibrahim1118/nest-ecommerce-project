import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { CreateTexDto } from './dto/create-tex.dto';
import { UpdateTexDto } from './dto/update-tex.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tex } from './entities/tex.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TexService {
  private readonly logger = new Logger(TexService.name);

  constructor(
    @InjectRepository(Tex)
    private texRepository: Repository<Tex>,
  ) {}

  async create(createTexDto: CreateTexDto) {
    try {
      this.logger.debug('Creating new tax configuration');

      // Validate input
      if (createTexDto.texPrice < 0) {
        throw new BadRequestException('Tax price cannot be negative');
      }
      if (createTexDto.shippingPrice < 0) {
        throw new BadRequestException('Shipping price cannot be negative');
      }

      // Check if tax configuration already exists
      const existingTax = await this.texRepository.find();
      if (existingTax.length > 0) {
        throw new BadRequestException('Tax configuration already exists. Please update the existing one.');
      }

      const tex = this.texRepository.create({
        texPrice: createTexDto.texPrice,
        shippingPrice: createTexDto.shippingPrice
      });

      this.logger.debug('Saving tax configuration');
      const savedTex = await this.texRepository.save(tex);
      this.logger.debug(`Tax configuration saved with ID ${savedTex.id}`);

      return savedTex;
    } catch (error) {
      this.logger.error('Error creating tax configuration:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create tax configuration: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const taxes = await this.texRepository.find();
      if (!taxes || taxes.length === 0) {
        this.logger.warn('No tax configurations found');
      }
      return taxes;
    } catch (error) {
      this.logger.error('Error fetching tax configurations:', error);
      throw new BadRequestException('Failed to fetch tax configurations');
    }
  }

  async findOne(id: number) {
    try {
      const tex = await this.texRepository.findOne({ where: { id } });
      if (!tex) {
        throw new NotFoundException(`Tax configuration with ID ${id} not found`);
      }
      return tex;
    } catch (error) {
      this.logger.error(`Error fetching tax configuration with ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to fetch tax configuration: ${error.message}`);
    }
  }

  async update(id: number, updateTexDto: UpdateTexDto) {
    try {
      const tex = await this.findOne(id);

      // Validate input
      if (updateTexDto.texPrice !== undefined && updateTexDto.texPrice < 0) {
        throw new BadRequestException('Tax price cannot be negative');
      }
      if (updateTexDto.shippingPrice !== undefined && updateTexDto.shippingPrice < 0) {
        throw new BadRequestException('Shipping price cannot be negative');
      }

      Object.assign(tex, updateTexDto);
      
      this.logger.debug(`Updating tax configuration with ID ${id}`);
      const updatedTex = await this.texRepository.save(tex);
      this.logger.debug('Tax configuration updated successfully');

      return updatedTex;
    } catch (error) {
      this.logger.error(`Error updating tax configuration with ID ${id}:`, error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update tax configuration: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const tex = await this.findOne(id);
      this.logger.debug(`Removing tax configuration with ID ${id}`);
      await this.texRepository.remove(tex);
      this.logger.debug('Tax configuration removed successfully');
      return { message: 'Tax configuration deleted successfully' };
    } catch (error) {
      this.logger.error(`Error removing tax configuration with ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to remove tax configuration: ${error.message}`);
    }
  }
}
