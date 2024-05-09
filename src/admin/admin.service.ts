import { BadRequestException, Injectable } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { CreateAdminDto } from './dto/create.dto';
import { Admin, AdminSafe } from './admin.entity';
import { hashData } from 'src/common/utilities/argon';
import { UpdateAdminDto } from './dto/update.dto';
import { DatatableParams } from 'types';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async getUser(params: DatatableParams): Promise<{
    data: AdminSafe[];
    total: number;
  }> {
    const [data, total] = await Promise.all([
      this.adminRepository.findAll(params),
      this.adminRepository.getTotal(params),
    ]);

    return { data, total };
  }

  async createAdmin(dto: CreateAdminDto): Promise<Admin> {
    const findByEmail = await this.adminRepository.findByEmail(dto.email);
    if (findByEmail != null) {
      const errorMessages = {
        email: ['email already exists'],
      };
      const errorResponse = {
        statusCode: 400,
        error: 'validation error',
        message: errorMessages,
      };

      throw new BadRequestException(errorResponse);
    }

    const passwordHash = await hashData(dto.password);
    const user: Admin = {
      name: dto.name,
      email: dto.email,
      password: passwordHash,
    };

    const create = await this.adminRepository.create(user);
    delete create.password;

    return create;
  }

  async updateAdmin(id: number, dto: UpdateAdminDto) {
    const findById = await this.adminRepository.findById(id);
    let passwordHash = findById.password;

    console.log('findById', findById);
    console.log('id', id);

    if (dto.password != undefined && dto.password != '') {
      passwordHash = await hashData(dto.password);
    }

    const user: Admin = {
      name: dto.name,
      email: dto.email,
      password: passwordHash,
    };

    const update = await this.adminRepository.update(id, user);
    delete update.password;

    return update;
  }

  async findAdminById(id: number): Promise<Admin> {
    return await this.adminRepository.findById(id);
  }

  async findAdminByEmail(email: string): Promise<Admin> {
    return await this.adminRepository.findByEmail(email);
  }

  async updateRefreshToken(id: number, refreshToken: string): Promise<Admin> {
    return await this.adminRepository.updateRefreshToken(id, refreshToken);
  }

  async deleteAdmin(id: number): Promise<Admin> {
    return await this.adminRepository.delete(id);
  }
}
