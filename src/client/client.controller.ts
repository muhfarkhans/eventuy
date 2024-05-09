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
import { ClientService } from './client.service';
import { UpdateClientDto } from './dto/update.dto';
import { CreateClientDto } from './dto/create.dto';
import { AuthGuard } from '@nestjs/passport';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Client } from './client.entity';
import { DatatableDTO } from 'src/common/dto/Datatable.dto';
import { DatatableResponse } from 'types';

@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @UseGuards(AuthGuard(['jwt-admin']))
  @Get('')
  async index(@Query() params: DatatableDTO) {
    console.log(params);

    const data = await this.clientService.getClient(params);

    const response: DatatableResponse = {
      data: data.data,
      meta: {
        total: data.total,
        ...params,
      },
    };

    return response;
  }

  @UseGuards(AuthGuard(['jwt-client', 'jwt-admin']))
  @Get(':id')
  find(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: Client,
    @IsAdmin() isAdmin: boolean,
  ) {
    if (!isAdmin) id = user.id;
    return this.clientService.findClientById(id);
  }

  @UseGuards(AuthGuard(['jwt-admin']))
  @Post()
  create(@Body() dto: CreateClientDto) {
    return this.clientService.createClient(dto);
  }

  @UseGuards(AuthGuard(['jwt-client', 'jwt-admin']))
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClientDto,
    @GetUser() user: Client,
    @IsAdmin() isAdmin: boolean,
  ) {
    if (!isAdmin) id = user.id;
    return this.clientService.updateClient(id, dto);
  }

  @UseGuards(AuthGuard(['jwt-admin']))
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.clientService.deleteClient(id);
  }
}
