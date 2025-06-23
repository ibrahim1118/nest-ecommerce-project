import { IsEmail, IsString, MinLength, IsOptional, Matches, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  

  password: string;

  @IsEnum(UserRole, { message: 'Invalid role' })
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Please provide a valid phone number',
  })
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
