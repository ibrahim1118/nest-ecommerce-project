import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from '../user/decorators/role.decorator';
import { AuthGuard } from '../user/guards/auth.guard';
import { UserRole } from '../user/entities/user.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles([UserRole.USER])
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    return this.orderService.create(createOrderDto, req.user.id);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles([UserRole.ADMIN])
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Get('user/:id')
  @UseGuards(AuthGuard)
  findAllByUserId(@Param('id') id: string) {
    return this.orderService.findAllByUserId(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles([UserRole.ADMIN])
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Get('my-orders')
  @UseGuards(AuthGuard)
  findMyOrders(@Req() req: any) {
    return this.orderService.findAllByUserId(req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles([UserRole.ADMIN])
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
