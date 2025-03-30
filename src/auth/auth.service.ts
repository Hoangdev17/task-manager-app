  import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import * as bcrypt from 'bcrypt';
  import { UserService } from '../user/user.service';
  import { AuthDto } from './dto/auth.dto';

  @Injectable()
  export class AuthService {
    constructor(
      private jwt: JwtService,
      private userService: UserService
    ) {}

    async register(dto: AuthDto) {
      const userExists = await this.userService.findByEmail(dto.email);
      if (userExists) throw new ConflictException('Email đã tồn tại');
    
      const hashed = await bcrypt.hash(dto.password, 10);
      const user = await this.userService.create({
        email: dto.email,
        password: hashed,
      });
    
      const token = await this.signToken(user._id as string, user.email);
    
      return {
        access_token: token,
        user,
      };
    }

    async login(dto: AuthDto) {
      const user = await this.userService.findByEmail(dto.email);
      if (!user) throw new UnauthorizedException('Sai tài khoản');

      const passwordMatch = await bcrypt.compare(dto.password, user.password);
      if (!passwordMatch) throw new UnauthorizedException('Sai mật khẩu');

      return this.signToken(user._id as string, user.email as string);
    }

    private async signToken(userId: string, email: string) {
      const payload = { sub: userId, email };
      return {
        access_token: await this.jwt.signAsync(payload),
        payload
      };
    }
  }
