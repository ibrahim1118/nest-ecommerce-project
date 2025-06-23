import { IsNumber, isNumber, IsString } from "class-validator";

export class UpdateCartQuantityDto {
    @IsNumber()
    productId: number;
    @IsString()
    opertion: string;
}