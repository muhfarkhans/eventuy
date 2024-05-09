import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-client') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET_CLIENT'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    console.log('payload', payload);

    const client = await this.prisma.userClient.findUnique({
      where: {
        id: payload.sub,
      },
    });

    delete client.password;

    return { user: client, isAdmin: false };
  }
}
