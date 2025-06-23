import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './entities/supplier.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SuppliersService {

  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto) {
    const supplier = await this.supplierRepository.findOne({where: {name: createSupplierDto.name}});
    if(supplier){
      throw new BadRequestException("Supplier already exists");
    }
    return await this.supplierRepository.save(createSupplierDto);
  }

 async  findAll() {
    return await this.supplierRepository.find();
  }

  async findOne(id: number) {
    const supplier = await this.supplierRepository.findOne({where: {id}});
    if(!supplier){
      throw new NotFoundException("Supplier not found");
    }
    return supplier;
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.supplierRepository.findOne({where: {id}});
    if(!supplier){
      throw new NotFoundException("Supplier not found");
    }
    return await this.supplierRepository.save({...supplier, ...updateSupplierDto});
  }

  async  remove(id: number) {
    const supplier = await this.supplierRepository.findOne({where: {id}});
    if(!supplier){
      throw new NotFoundException("Supplier not found");
    }
    return await this.supplierRepository.delete(id);
  }
}
