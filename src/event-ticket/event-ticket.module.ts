import { Module } from '@nestjs/common';
import { EventTicketService } from './event-ticket.service';
import { EventTicketController } from './event-ticket.controller';
import { EventTicketRepository } from './event-ticket.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [EventTicketService, EventTicketRepository],
  controllers: [EventTicketController],
})
export class EventTicketModule {}
