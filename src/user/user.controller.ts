import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update.dto';
import { CreateUserDto } from './dto/create.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';
import { User } from './user.entity';
import { DatatableDTO } from 'src/common/dto/datatable.dto';
import { DatatableResponse } from 'types';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard(['jwt-admin']))
  @Get('')
  async index(@Query() params: DatatableDTO) {
    console.log(params);

    const data = await this.userService.getUser(params);

    const response: DatatableResponse = {
      data: data.data,
      meta: {
        total: data.total,
        ...params,
      },
    };

    return response;
  }

  @UseGuards(AuthGuard(['jwt', 'jwt-admin']))
  @Get(':id')
  find(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: { user: User },
    @IsAdmin() isAdmin: boolean,
  ) {
    if (!isAdmin) id = user.user.id;
    return this.userService.findUserById(id);
  }

  @UseGuards(AuthGuard(['jwt-admin']))
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @UseGuards(AuthGuard(['jwt', 'jwt-admin']))
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @GetUser() user: { user: User },
    @IsAdmin() isAdmin: boolean,
  ) {
    if (!isAdmin) id = user.user.id;
    return this.userService.updateUser(id, dto);
  }

  @UseGuards(AuthGuard(['jwt-admin']))
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
