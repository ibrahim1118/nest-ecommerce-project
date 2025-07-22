import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dtos/sign_up.dto';
import { SignInDto } from './dtos/sign_in.dto'; 
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async signup(signUpDto: SignUpDto) {
        const user = await this.userService.create(signUpDto);
        // create secret key refresh token
        const refreshToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            count: 10,
        }, {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: '30d',
        });
        return {
            access_token: await this.jwtService.signAsync({
                sub: user.id,
                email: user.email,
                role: user.role,
            }),
            refresh_token: refreshToken,
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
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        // create secret key refresh token
        const refreshToken = await this.jwtService.signAsync({...payload, count: 10}, {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: '30d',
        });
        
        return {
            access_token: await this.jwtService.signAsync(payload),
            refresh_token: refreshToken,
        };
    }

    async googleLogin(googleUser: any) {
        if (!googleUser) {
            throw new UnauthorizedException('No user from Google');
        }

        // Find user by email or create a new one
        let user = await this.userService.findByEmail(googleUser.email);
        
        if (!user) {
            // Create new user from Google data
            const createUserDto: SignUpDto = {
                email: googleUser.email,
                firstName: googleUser.firstName,
                lastName: googleUser.lastName,
                password: Math.random().toString(36).slice(-8), // Generate random password
            };
            
            user = await this.userService.create(createUserDto);
        }
         // create secret key refresh token
         const refreshToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            count: 10,
         }, {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: '30d',
         });
        return {
            access_token: await this.jwtService.signAsync({
                sub: user.id,
                email: user.email,
                role: user.role,
            }),
            refresh_token: refreshToken,
        };
    }

    async refreshToken(refreshTokenDto: any) {
        const { refresh_token } = refreshTokenDto;
        const decoded = await this.jwtService.verifyAsync(refresh_token, {
            secret: process.env.REFRESH_TOKEN_SECRET,
        });
        if (decoded.count > 0) {
            const user = await this.userService.findOne(decoded.sub);
            const payload = {
                sub: user.id,
                email: user.email,
                role: user.role,
            };
            const refreshToken = await this.jwtService.signAsync({...payload, count: decoded.count - 1}, {
                secret: process.env.REFRESH_TOKEN_SECRET,
                expiresIn: '30d',
            });
            return {
                access_token: await this.jwtService.signAsync(payload),
                refresh_token: refreshToken,
            };
        }
        throw new UnauthorizedException('Refresh token expired');
    }
}
