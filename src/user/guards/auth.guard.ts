import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
import { Roles } from '../decorators/role.decorator';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService , 
        private readonly reflector: Reflector
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      const requiredRoles = this.reflector.get<string[]>(Roles,context.getHandler());
      ////console.log(requiredRoles);
      //console.log(token);
      if (!token) {
        throw new UnauthorizedException();
      }
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET
        });
        console.log('JWT Payload:', payload);
    
        if (requiredRoles && !requiredRoles.includes(payload.role)) {
            console.log(requiredRoles && !requiredRoles.includes(payload.role));
          throw new UnauthorizedException();
        }
       // console.log(requiredRoles) ;
        //console.log(payload.role);

        //console.log(payload);
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = {
          ...payload,
          id: payload.sub || payload.id // Handle both possible ID fields
        };
        console.log('Request user object:', request['user']);
      } catch (error) {
        console.error('Auth error:', error);
        throw new UnauthorizedException();
      }
      //console.log("true");
      console.log(request['user'].id);
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }
  