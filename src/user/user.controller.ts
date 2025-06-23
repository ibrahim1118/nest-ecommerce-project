import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
  ValidationPipe,
  UseGuards,
  Query,
  Req,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';
import { Roles } from './decorators/role.decorator';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(["admin"])
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe({ transform: true })) createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: any): Promise<any> {
    return this.userService.findAll(query);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @Roles(["admin" , "user"])
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req: Request): Promise<User> {
    console.log('Controller - Request user:', req['user']);
    const userId = req['user'].id || req['user'].sub;
    console.log('Controller - Using user ID:', userId);
    return this.userService.getProfile(userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ transform: true, skipMissingProperties: true })) updateData: Partial<CreateUserDto>,
  ): Promise<User> {
    return this.userService.update(id, updateData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.userService.remove(id);
  }
}
