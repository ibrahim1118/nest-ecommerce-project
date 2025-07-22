import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign_up.dto';
import { SignInDto } from './dtos/sign_in.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }

  @Post('signin')
  async signin(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // This endpoint initiates the Google OAuth flow
    // The guard will handle the redirect
  }

  @Get('googel/callBack')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any) {
    // Log the user data we receive from Google
    console.log('Google user data:', JSON.stringify(req.user, null, 2));
    return this.authService.googleLogin(req.user);
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: any) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
