import { DatatableParams } from 'types';
import { Event } from './event.entity';

export interface IEventRepository {
  create(data: Event): Promise<Event>;
  findAll(props: DatatableParams): Promise<Event[]>;
  getTotal(props?: DatatableParams): Promise<number>;
  findById(id: number): Promise<Event>;
  findByClient(clientId: number): Promise<Event[]>;
  update(id: number, data: Event): Promise<Event>;
  delete(id: number): Promise<Event>;
}
