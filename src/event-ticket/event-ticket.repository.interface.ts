import { EventTicket } from './event-ticket.entity';

export interface IEventTicketRepository {
  create(data: EventTicket): Promise<EventTicket>;
  findAll(): Promise<EventTicket[]>;
  findById(id: number): Promise<EventTicket>;
  findByEvent(eventId: number): Promise<EventTicket[]>;
  update(id: number, data: EventTicket): Promise<EventTicket>;
  delete(id: number): Promise<EventTicket>;
  hasEvent(clientId: number): Promise<any>;
  hasEventFromTicket(id: number, clientId: number): Promise<any>;
}
