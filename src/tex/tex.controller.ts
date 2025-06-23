import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TexService } from './tex.service';
import { CreateTexDto } from './dto/create-tex.dto';
import { UpdateTexDto } from './dto/update-tex.dto';

@Controller('tex')
export class TexController {
  constructor(private readonly texService: TexService) {}

  @Post()
  create(@Body() createTexDto: CreateTexDto) {
    return this.texService.create(createTexDto);
  }

  @Get()
  findAll() {
    return this.texService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.texService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTexDto: UpdateTexDto) {
    return this.texService.update(+id, updateTexDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.texService.remove(+id);
  }
}
