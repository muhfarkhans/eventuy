import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthClientController } from './auth-client.controller';
import { AuthClientService } from './auth-client.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [JwtModule.register({}), ClientModule],
  controllers: [AuthClientController],
  providers: [AuthClientService, JwtStrategy, RefreshTokenStrategy],
})
export class AuthClientModule {}
