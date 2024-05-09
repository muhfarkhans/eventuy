import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET_ADMIN'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        id: payload.sub,
      },
    });
    delete admin.password;
    console.log('admin', admin);

    return { user: admin, isAdmin: true };
  }
}
