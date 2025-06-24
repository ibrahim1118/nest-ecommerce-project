import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req, Put, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/role.decorator';
import { UpdateCartQuantityDto } from './dto/update.car.quantity.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-to-cart')
  @UseGuards(AuthGuard)
  @Roles(['user'])
  async addToCart(@Body() createCartDto: CreateCartDto, @Req() req: any) {
    return this.cartService.addToCart(createCartDto, req.user.id);
  }

  @Put('delete-from-cart')
  @UseGuards(AuthGuard)
  @Roles(['user'])
  async deleteFromCart(@Body() updateCartDto: UpdateCartDto, @Req() req: any) {
 
    return this.cartService.updateCart(updateCartDto, req.user.id);
  }
  
  @Put('update-quantity-cart')
  @UseGuards(AuthGuard)
  @Roles(['user'])
  async updateQuantityCart(@Body() updateCartDto: UpdateCartQuantityDto, @Req() req: any) {
    return this.cartService.updateQuantityCart(updateCartDto, req.user.id);
  }


  @Get()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  async findAll() {
    return this.cartService.findAll();
    // 
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.findOne(id);
  }

  @Get('user-cart')
  @UseGuards(AuthGuard)
  @Roles(['user'])
  async userCart(@Req() req: any) {
    return this.cartService.userCart(req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['user', 'admin'])
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.remove(id);
  }
}
