import { IsNotEmpty, IsString, IsArray, ValidateNested, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../enums/payment.method.enum';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  shippingAddress: string;

  @IsNotEmpty()
  @IsEnum(PaymentMethod, { message: 'Invalid payment method' })
  paymentMethod: PaymentMethod;

}
