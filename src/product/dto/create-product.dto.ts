import { IsNotEmpty, IsNumber, IsString, Min, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    price: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    priceAfterDiscount: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    quantity: number;

    @IsNotEmpty()
    @IsString()
    image: string;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    @IsOptional()
    sold: number = 0;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    color: string[];

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    subCategoryId: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    brandId: number;
}
