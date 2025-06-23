import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTexDto } from './dto/create-tex.dto';
import { UpdateTexDto } from './dto/update-tex.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tex } from './entities/tex.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TexService {
  constructor(
    @InjectRepository(Tex)
    private texRepository: Repository<Tex>,
  ) {}

  async create(createTexDto: CreateTexDto) {
    
    const tex = await this.texRepository.create(createTexDto);
    return await this.texRepository.save(tex);
  }

  async findAll() {
    return await this.texRepository.find();
  }

  async findOne(id: number) {
    return await this.texRepository.findOne({where: {id}});
  } 

  async update(id: number, updateTexDto: UpdateTexDto) {
    const tex = await this.texRepository.findOne({where: {id}});
    if(!tex){
      throw new NotFoundException("Tex not found");
    }
    return await this.texRepository.update(id, {texPrice: updateTexDto.texPrice, shippingPrice: updateTexDto.shippingPrice});
  }

  async remove(id: number) {
    const tex = await this.texRepository.findOne({where: {id}});
    if(!tex){
      throw new NotFoundException("Tex not found");
    }
    return await this.texRepository.delete(id);
  }
}
