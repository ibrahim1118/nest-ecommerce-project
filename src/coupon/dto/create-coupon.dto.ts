import { IsDate, IsNotEmpty, IsNumber, IsString, Min, MinLength } from "class-validator";

export class CreateCouponDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    discount: number;

    @IsNotEmpty()
    @IsDate()
    expiryDate: Date;
}
