import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';

@Injectable()
export class CouponService {

  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  async create(createCouponDto: CreateCouponDto) {
    const coupon = await this.couponRepository.findOne({where: {name: createCouponDto.name}});
    if(coupon){
      throw new BadRequestException("Coupon already exists");
    }
     const newcoupon = this.couponRepository.create(createCouponDto);
     return this.couponRepository.save(newcoupon);
  }

  async findAll() {
    return await this.couponRepository.find();
  }

  async findOne(id: number) {
    const coupon = await this.couponRepository.findOne({where: {id}});
    if(!coupon){
      throw new NotFoundException("Coupon not found");
    }
    return coupon;
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.couponRepository.findOne({where: {id}});
    if(!coupon){
      throw new NotFoundException("Coupon not found");
    }
    return await this.couponRepository.save({...coupon, ...updateCouponDto});
  }

  async remove(id: number) {
    const coupon = await this.couponRepository.findOne({where: {id}});
    if(!coupon){
      throw new NotFoundException("Coupon not found");
    }
    return await this.couponRepository.delete(id);
  }
}
