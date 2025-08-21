import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const token = req.cookies?.auth;
    if (!token) throw new UnauthorizedException();
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET!);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
