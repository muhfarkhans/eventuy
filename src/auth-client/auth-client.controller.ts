import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { AuthClientService } from './auth-client.service';
import { Client } from 'src/client/client.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth-client')
export class AuthClientController {
  constructor(private authService: AuthClientService) {}

  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @UseGuards(AuthGuard(['jwt-refresh-client']))
  @Get('refresh')
  async refreshTokens(@Req() req: Request) {
    const userId = req['user']['sub'];
    const refreshToken = req['user']['refreshToken'];
    console.log('refreshToken', refreshToken);

    const user = await this.authService.updateRefreshTokens(
      userId,
      refreshToken,
    );
    delete user.password;

    return user;
  }

  @UseGuards(AuthGuard(['jwt-client']))
  @Get('signout')
  async logout(@Req() req: Request) {
    const userId = req['user']['id'];
    await this.authService.updateRefreshTokens(userId, '');
    return 1;
  }

  @UseGuards(AuthGuard(['jwt-client', 'jwt-admin']))
  @Get('fetch')
  fetch(@GetUser('') client: Client) {
    return client;
  }
}
