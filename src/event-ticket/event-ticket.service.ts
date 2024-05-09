import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { EventTicket } from './event-ticket.entity';
import { EventTicketRepository } from './event-ticket.repository';
import { CreateEventTicketDto } from './dto/create.dto';
import { UpdateEventTicketDto } from './dto/update.dto';

@Injectable()
export class EventTicketService {
  constructor(private readonly eventTicketRepository: EventTicketRepository) {}

  async getEventTicket(): Promise<EventTicket[]> {
    return this.eventTicketRepository.findAll();
  }

  async createEventTicket(
    dto: CreateEventTicketDto,
    clientId: number,
  ): Promise<EventTicket> {
    const hasEvent = await this.eventTicketRepository.hasEvent(clientId);
    console.log('hasEvent', hasEvent);
    if (!hasEvent) throw new ForbiddenException('Forbidden');

    const ticket: EventTicket = {
      eventId: dto.eventId,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      available: dto.available,
      color: dto.color,
    };

    const create = await this.eventTicketRepository.create(ticket);

    return create;
  }

  async updateEventTicket(
    id: number,
    dto: UpdateEventTicketDto,
    clientId: number,
    isAdmin: boolean,
  ) {
    const findById = await this.eventTicketRepository.findById(id);
    if (!findById) throw new BadRequestException('Data not found.');

    const hasEvent = await this.eventTicketRepository.hasEventFromTicket(
      id,
      clientId,
    );
    console.log('hasEvent', hasEvent);
    if (!hasEvent) {
      if (!isAdmin) throw new ForbiddenException('Forbidden');
    }

    console.log('findById', findById);
    console.log('id', id);

    const ticket: EventTicket = {
      eventId: dto.eventId,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      available: dto.available,
      color: dto.color,
    };

    const update = await this.eventTicketRepository.update(id, ticket);

    return update;
  }

  async findEventTicketById(id: number): Promise<EventTicket> {
    return await this.eventTicketRepository.findById(id);
  }

  async findEventTicketByEventId(id: number): Promise<EventTicket[]> {
    return await this.eventTicketRepository.findByEvent(id);
  }

  async deleteEventTicket(
    id: number,
    clientId: number,
    isAdmin: boolean,
  ): Promise<EventTicket> {
    const findById = await this.eventTicketRepository.findById(id);
    if (!findById) throw new BadRequestException('Data not found.');

    const hasEvent = await this.eventTicketRepository.hasEventFromTicket(
      id,
      clientId,
    );
    console.log('hasEvent', hasEvent);
    if (!hasEvent) {
      if (!isAdmin) throw new ForbiddenException('Forbidden');
    }

    return await this.eventTicketRepository.delete(id);
  }
}
