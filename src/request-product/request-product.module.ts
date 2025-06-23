import { Module } from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { RequestProductController } from './request-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestProduct } from './entities/request-product.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([RequestProduct]), UserModule],
  controllers: [RequestProductController],
  providers: [RequestProductService],
})
export class RequestProductModule {}
