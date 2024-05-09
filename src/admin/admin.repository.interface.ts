import { DatatableParams } from 'types';
import { Admin, AdminSafe } from './admin.entity';

export interface IAdminRepository {
  create(data: Admin): Promise<Admin>;
  findAll(props: DatatableParams): Promise<AdminSafe[]>;
  getTotal(props?: DatatableParams): Promise<number>;
  findById(id: number): Promise<Admin>;
  findByEmail(email: string): Promise<Admin>;
  update(id: number, data: Admin): Promise<Admin>;
  updateRefreshToken(id: number, refreshToken: string): Promise<Admin>;
  delete(id: number): Promise<Admin>;
}
