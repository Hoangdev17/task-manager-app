import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { JwtService } from '@nestjs/jwt';
  import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
  
  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwt: JwtService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );
  
      if (isPublic) {
        return true;
      }
  
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Không có token');
      }
  
      const token = authHeader.split(' ')[1];
  
      try {
        const payload = await this.jwt.verifyAsync(token);
        request.user = payload;
        return true;
      } catch (e) {
        throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
      }
    }
  }
  