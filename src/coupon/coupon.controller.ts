import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/role.decorator';

@Controller('coupon')
@UseGuards(AuthGuard)
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Roles(['admin'])
  @Post()
  async create(@Body() createCouponDto: CreateCouponDto) {
    return await this.couponService.create(createCouponDto);
  }
  @Roles(['admin'])
  @Get()
  async findAll() {
    return await this.couponService.findAll();
  }

  @Roles(['admin'])
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.couponService.findOne(+id);
  }

  @Roles(['admin'])
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return await this.couponService.update(+id, updateCouponDto);
  }

  @Roles(['admin'])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.couponService.remove(+id);
  }
}
