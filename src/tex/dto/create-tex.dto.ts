import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTexDto {
    @IsNotEmpty()
    @IsNumber()
    texPrice: number;

    @IsNotEmpty()
    @IsNumber()
    shippingPrice: number;
}
