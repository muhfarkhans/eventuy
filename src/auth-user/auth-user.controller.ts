import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthUserService } from './auth-user.service';
import { SigninDto } from './dto/signin.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/user/user.entity';
import { SignupDto } from './dto/signup.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth-user')
export class AuthUserController {
  constructor(private authService: AuthUserService) {}

  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @UseGuards(AuthGuard(['jwt-refresh']))
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

  @UseGuards(AuthGuard(['jwt']))
  @Get('signout')
  async logout(@Req() req: Request) {
    const userId = req['user']['id'];
    await this.authService.updateRefreshTokens(userId, '');
    return 1;
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get('fetch')
  fetch(@GetUser('') user: User) {
    return user;
  }
}
