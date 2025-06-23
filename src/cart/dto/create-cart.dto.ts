import { ArrayMinSize, IsArray, IsNumber, IsOptional, Min } from "class-validator";

export class CreateCartDto {
    @IsArray()
    @IsNumber({}, { each: true })
    @ArrayMinSize(1)
    productIds: number[];

    @IsOptional()
    @IsNumber()
    userId?: number;

    @IsOptional()
    @IsNumber()
    couponId?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    quantity?: number;

}
