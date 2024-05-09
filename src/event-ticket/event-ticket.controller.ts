import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EventTicketService } from './event-ticket.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { CreateEventTicketDto } from './dto/create.dto';
import { UpdateEventTicketDto } from './dto/update.dto';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';

@Controller('event-ticket')
export class EventTicketController {
  constructor(private eventTicketService: EventTicketService) {}

  @Get('')
  index() {
    return this.eventTicketService.getEventTicket();
  }

  @Get(':id')
  find(@Param('id', ParseIntPipe) id: number) {
    return this.eventTicketService.findEventTicketById(id);
  }

  @Get(':eventId')
  findByEvent(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.eventTicketService.findEventTicketByEventId(eventId);
  }

  @UseGuards(AuthGuard(['jwt-client']))
  @Post('')
  create(@GetUser() client: any, @Body() dto: CreateEventTicketDto) {
    return this.eventTicketService.createEventTicket(dto, client.user.id);
  }

  @UseGuards(AuthGuard(['jwt-admin', 'jwt-client']))
  @Put(':id')
  update(
    @GetUser('') client: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEventTicketDto,
    @IsAdmin() isAdmin: boolean,
  ) {
    return this.eventTicketService.updateEventTicket(
      id,
      dto,
      client.user.id,
      isAdmin,
    );
  }

  @UseGuards(AuthGuard(['jwt-admin', 'jwt-client']))
  @Delete(':id')
  delete(
    @GetUser('') client: any,
    @Param('id', ParseIntPipe) id: number,
    @IsAdmin() isAdmin: boolean,
  ) {
    return this.eventTicketService.deleteEventTicket(
      id,
      client.user.id,
      isAdmin,
    );
  }
}
