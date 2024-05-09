import { Injectable } from '@nestjs/common';
import { IEventTicketRepository } from './event-ticket.repository.interface';
import { EventTicket } from './event-ticket.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventTicketRepository implements IEventTicketRepository {
  constructor(private prisma: PrismaService) {}

  create(data: EventTicket): Promise<EventTicket> {
    return this.prisma.eventTicket.create({ data });
  }

  findAll(): Promise<EventTicket[]> {
    return this.prisma.eventTicket.findMany({});
  }

  findById(id: number): Promise<EventTicket> {
    return this.prisma.eventTicket.findFirst({ where: { id } });
  }

  findByEvent(eventId: number): Promise<EventTicket[]> {
    return this.prisma.eventTicket.findMany({ where: { eventId } });
  }

  update(id: number, data: EventTicket): Promise<EventTicket> {
    return this.prisma.eventTicket.update({ where: { id }, data });
  }

  delete(id: number): Promise<EventTicket> {
    return this.prisma.eventTicket.delete({ where: { id } });
  }

  hasEvent(clientId: number): Promise<any> {
    return this.prisma.$queryRaw<any>`
        SELECT *
        FROM "Event" as e
        JOIN "EventTicket" as et ON et."eventId" = e."id"
        WHERE et."clientId" = ${clientId};
      `;
  }

  hasEventFromTicket(id: number, clientId: number): Promise<any> {
    return this.prisma.$queryRaw<any>`
        SELECT *
        FROM "Event" as e
        JOIN "EventTicket" as et ON et."eventId" = e."id"
        WHERE et."id" = ${id} && et."clientId" = ${clientId};
      `;
  }
}
