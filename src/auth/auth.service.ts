import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dtos/sign_up.dto';
import { User } from '../user/entities/user.entity';
import { SignInDto } from './dtos/sign_in.dto'; 
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async signup(signUpDto: SignUpDto) {
        const user = await this.userService.create(signUpDto);
        return {
            access_token: await this.jwtService.signAsync({
                sub: user.id,
                email: user.email,
                role: user.role,
            }),
        };
    }

    async signin(signInDto: SignInDto) {
        const user = await this.userService.findByEmail(signInDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await this.userService.validatePassword(signInDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {
            sub: user.id, // Using sub for the user ID
            email: user.email,
            role: user.role,
        };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

   
}
