import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateBrandDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name: string;

    
    @IsString()
    @MinLength(3)
    image: string;

    
}
