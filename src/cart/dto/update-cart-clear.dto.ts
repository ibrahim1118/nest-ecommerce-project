import { IsArray, IsNumber, IsOptional } from "class-validator";

export class UpdateCartClearDto {
    @IsOptional()
    @IsArray()
    products: any[];

    @IsNumber()
    totalprice: number;

    @IsNumber()
    totalPriceAfterDiscount: number;
} 