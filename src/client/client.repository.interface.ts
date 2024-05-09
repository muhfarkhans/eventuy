import { DatatableParams } from 'types';
import { Client, ClientSafe } from './client.entity';

export interface IClientRepository {
  create(data: Client): Promise<Client>;
  findAll(props: DatatableParams): Promise<ClientSafe[]>;
  getTotal(props?: DatatableParams): Promise<number>;
  findById(id: number): Promise<Client>;
  findByEmail(email: string): Promise<Client>;
  update(id: number, data: Client): Promise<Client>;
  updateRefreshToken(id: number, refreshToken: string): Promise<Client>;
  delete(id: number): Promise<Client>;
}
