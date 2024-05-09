import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthAdminController } from './auth-admin.controller';
import { AuthAdminService } from './auth-admin.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [JwtModule.register({}), AdminModule],
  controllers: [AuthAdminController],
  providers: [AuthAdminService, JwtStrategy, RefreshTokenStrategy],
})
export class AuthAdminModule {}
