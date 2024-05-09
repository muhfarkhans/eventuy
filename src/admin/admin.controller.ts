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
import { AdminService } from './admin.service';
import { UpdateAdminDto } from './dto/update.dto';
import { CreateAdminDto } from './dto/create.dto';
import { AuthGuard } from '@nestjs/passport';
import { DatatableDTO } from 'src/common/dto/Datatable.dto';
import { DatatableResponse } from 'types';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @UseGuards(AuthGuard(['jwt-admin']))
  @Get('')
  async index(@Query() params: DatatableDTO) {
    console.log(params);

    const data = await this.adminService.getUser(params);

    const response: DatatableResponse = {
      data: data.data,
      meta: {
        total: data.total,
        ...params,
      },
    };

    return response;
  }

  @UseGuards(AuthGuard(['jwt-admin']))
  @Get(':id')
  find(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.findAdminById(id);
  }

  @UseGuards(AuthGuard(['jwt-admin']))
  @Post()
  create(@Body() dto: CreateAdminDto) {
    return this.adminService.createAdmin(dto);
  }

  @UseGuards(AuthGuard(['jwt-admin']))
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAdminDto) {
    return this.adminService.updateAdmin(id, dto);
  }

  @UseGuards(AuthGuard(['jwt-admin']))
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteAdmin(id);
  }
}
