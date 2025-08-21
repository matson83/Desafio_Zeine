import { Body, Controller, Post, Res, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  async register(@Body() body: {name:string; email:string; password:string}) {
    return this.auth.register(body.name, body.email, body.password);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.validate(dto.email, dto.password);
    const token = this.auth.sign(user.id);
    res.cookie('auth', token, { httpOnly: true, sameSite: 'lax', maxAge: 3600_000 });
    return { user: { id: user.id, name: user.name, email: user.email } };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth');
    return { ok: true };
  }

  @Get('me')
  async me(@Req() req: Request) {
    const token = req.cookies?.auth;
    if (!token) return { user: null };
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      return { userId: payload.sub };
    } catch {
      return { user: null };
    }
  }
}