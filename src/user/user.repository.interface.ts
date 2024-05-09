import { DatatableParams } from 'types';
import { User, UserSafe } from './user.entity';

export interface IUserRepository {
  create(data: User): Promise<User>;
  findAll(props: DatatableParams): Promise<UserSafe[]>;
  getTotal(props?: DatatableParams): Promise<number>;
  findById(id: number): Promise<User>;
  findByEmail(email: string): Promise<User>;
  update(id: number, data: User): Promise<User>;
  updateRefreshToken(id: number, refreshToken: string): Promise<User>;
  delete(id: number): Promise<User>;
}
