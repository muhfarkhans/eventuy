import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthUserController } from './auth-user.controller';
import { AuthUserService } from './auth-user.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [JwtModule.register({}), UserModule],
  controllers: [AuthUserController],
  providers: [AuthUserService, JwtStrategy, RefreshTokenStrategy],
})
export class AuthUserModule {}
