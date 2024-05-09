import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/admin.service';
import { SigninDto } from './dto/signin.dto';
import { hashData, verifyHashData } from 'src/common/utilities/argon';

@Injectable()
export class AuthAdminService {
  constructor(
    private readonly adminService: AdminService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signin(dto: SigninDto) {
    const admin = await this.adminService.findAdminByEmail(dto.email);
    if (!admin) throw new ForbiddenException('Credentials incorrect');

    const passwordMatches = await verifyHashData(admin.password, dto.password);
    if (!passwordMatches) throw new ForbiddenException('Credentials incorrect');

    const tokens = await this.getTokens(admin.id, admin.email);
    await this.updateRefreshTokens(admin.id, tokens.refreshToken);

    return tokens;
  }

  async updateRefreshTokens(id: number, refreshToken: string) {
    const refreshTokenHash = await hashData(refreshToken);
    const admin = await this.adminService.updateRefreshToken(
      id,
      refreshTokenHash,
    );

    return admin;
  }

  async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.sign(
        { sub: userId, email: email },
        {
          secret: this.config.get('JWT_SECRET_ADMIN'),
          expiresIn: '24h',
        },
      ),
      this.jwt.signAsync(
        { sub: userId, email: email },
        {
          secret: this.config.get('JWT_REFRESH_SECRET_ADMIN'),
          expiresIn: '1w',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
