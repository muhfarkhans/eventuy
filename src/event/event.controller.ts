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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventService } from './event.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { CreateEventDto } from './dto/create.dto';
import { UpdateEventDto } from './dto/update.dto';
import { AuthGuard } from '@nestjs/passport';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { DatatableDTO } from 'src/common/dto/datatable.dto';
import { DatatableResponse } from 'types';
import { RejectEventDto } from './dto/reject.dto';

@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {}

  @Get('')
  async index(@Query() params: DatatableDTO) {
    console.log(params);

    const data = await this.eventService.getEvent(params);

    const response: DatatableResponse = {
      data: data.data,
      meta: {
        total: data.total,
        ...params,
      },
    };

    return response;
  }

  @Get(':id')
  find(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.findEventById(id);
  }

  @Get(':clientId')
  findByClient(@Param('clientId', ParseIntPipe) clientId: number) {
    return this.eventService.findEventByClient(clientId);
  }

  @UseGuards(AuthGuard(['jwt-client']))
  @Post('')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
    ]),
  )
  create(
    @GetUser() client: any,
    @Body() dto: CreateEventDto,
    @UploadedFiles()
    files: { thumbnail: Express.Multer.File[]; logo: Express.Multer.File[] },
  ) {
    const thumbnail = files.thumbnail?.[0];
    const logo = files.logo?.[0];

    return this.eventService.createEvent(dto, thumbnail, logo, client.user.id);
  }

  @UseGuards(AuthGuard(['jwt-admin']))
  @Post('client/:clientId')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
    ]),
  )
  createByAdmin(
    @GetUser() admin: any,
    @Body() dto: CreateEventDto,
    @Param('clientId', ParseIntPipe) clientId: number,
    @UploadedFiles()
    files: { thumbnail: Express.Multer.File[]; logo: Express.Multer.File[] },
  ) {
    const thumbnail = files.thumbnail?.[0];
    const logo = files.logo?.[0];

    return this.eventService.createEvent(
      dto,
      thumbnail,
      logo,
      clientId,
      admin.user.id,
    );
  }

  @UseGuards(AuthGuard(['jwt-admin']))
  @Post('/:id/accept')
  acceptEvent(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.acceptEvent(id);
  }

  @UseGuards(AuthGuard(['jwt-admin']))
  @Post('/:id/reject')
  rejectEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RejectEventDto,
  ) {
    return this.eventService.rejectEvent(id, dto.rejectReason);
  }

  @UseGuards(AuthGuard(['jwt-admin', 'jwt-client']))
  @Post('/:id/publish')
  publishEvent(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.publishEvent(id);
  }

  @UseGuards(AuthGuard(['jwt-admin', 'jwt-client']))
  @Post('/:id/unpublish')
  unPublishEvent(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.unPublishEvent(id);
  }

  @UseGuards(AuthGuard(['jwt-admin', 'jwt-client']))
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
    ]),
  )
  update(
    @GetUser('') client: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEventDto,
    @UploadedFiles()
    files: { thumbnail: Express.Multer.File[]; logo: Express.Multer.File[] },
    @IsAdmin() isAdmin: boolean,
  ) {
    const thumbnail = files.thumbnail?.[0];
    const logo = files.logo?.[0];

    return this.eventService.updateEvent(
      id,
      dto,
      thumbnail,
      logo,
      client.user.id,
      isAdmin,
    );
  }

  @UseGuards(AuthGuard(['jwt-admin']))
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.deleteEvent(id);
  }
}
