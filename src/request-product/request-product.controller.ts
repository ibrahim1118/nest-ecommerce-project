import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Req
} from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/role.decorator';

@Controller('request-product')
@UseGuards(AuthGuard)
export class RequestProductController {
  constructor(private readonly requestProductService: RequestProductService) {}

  @Post()
  @Roles(['user', 'admin'])
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe({ transform: true })) createRequestProductDto: CreateRequestProductDto,
    @Req() req: Request
  ) {
    const userId = req['user'].id || req['user'].sub;
    return await this.requestProductService.create(createRequestProductDto, userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.requestProductService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.requestProductService.findOne(id);
  }

  @Patch(':id')
  @Roles(['user', 'admin'])
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true })) updateRequestProductDto: UpdateRequestProductDto
  ) {
    return await this.requestProductService.update(id, updateRequestProductDto);
  }

  @Delete(':id')
  @Roles(['user', 'admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.requestProductService.remove(id);
  }
}
