import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthAdminService } from './auth-admin.service';
import { SigninDto } from './dto/signin.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Admin } from 'src/admin/admin.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth-admin')
export class AuthAdminController {
  constructor(private authService: AuthAdminService) {}

  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @UseGuards(AuthGuard(['jwt-refresh-admin']))
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

  @UseGuards(AuthGuard(['jwt-admin']))
  @Get('signout')
  async logout(@Req() req: Request) {
    const userId = req['user']['id'];
    await this.authService.updateRefreshTokens(userId, '');
    return 1;
  }

  @UseGuards(AuthGuard(['jwt-admin']))
  @Get('fetch')
  fetch(@GetUser('') admin: Admin) {
    return admin;
  }
}
