import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from "class-validator";

export class CreateRequestProductDto {

    @IsNotEmpty()
    @IsString()
    titleNeed: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity: number;

    @IsNotEmpty()
    @IsString()
    category: string;
  
}
