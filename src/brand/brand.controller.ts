import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, ValidationPipe, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/role.decorator';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(new ValidationPipe({ transform: true })) createBrandDto: CreateBrandDto) {
    return await this.brandService.create(createBrandDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.brandService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.brandService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string, 
    @Body(new ValidationPipe({ transform: true })) updateBrandDto: UpdateBrandDto
  ) {
    return await this.brandService.update(+id, updateBrandDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.brandService.remove(+id);
  }
}
