import { BadRequestException, Injectable } from '@nestjs/common';
import { ClientRepository } from './client.repository';
import { CreateClientDto } from './dto/create.dto';
import { Client, ClientSafe } from './client.entity';
import { hashData } from 'src/common/utilities/argon';
import { UpdateClientDto } from './dto/update.dto';
import { DatatableParams } from 'types';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async getClient(params: DatatableParams): Promise<{
    data: ClientSafe[];
    total: number;
  }> {
    const [data, total] = await Promise.all([
      this.clientRepository.findAll(params),
      this.clientRepository.getTotal(params),
    ]);

    return { data, total };
  }

  async createClient(dto: CreateClientDto): Promise<Client> {
    const findByEmail = await this.clientRepository.findByEmail(dto.email);
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
    const user: Client = {
      name: dto.name,
      email: dto.email,
      password: passwordHash,
      address: dto.address,
      phone: dto.phone,
      isVerified: 0,
    };

    const create = await this.clientRepository.create(user);
    delete create.password;

    return create;
  }

  async updateClient(id: number, dto: UpdateClientDto) {
    const findById = await this.clientRepository.findById(id);
    let passwordHash = findById.password;

    console.log('findById', findById);
    console.log('id', id);

    if (dto.password != undefined && dto.password != '') {
      passwordHash = await hashData(dto.password);
    }

    const user: Client = {
      name: dto.name,
      email: dto.email,
      password: passwordHash,
      address: dto.address,
      phone: dto.phone,
      isVerified: findById.isVerified,
    };

    const update = await this.clientRepository.update(id, user);
    delete update.password;

    return update;
  }

  async findClientById(id: number): Promise<Client> {
    return await this.clientRepository.findById(id);
  }

  async findClientByEmail(email: string): Promise<Client> {
    return await this.clientRepository.findByEmail(email);
  }

  async updateRefreshToken(id: number, refreshToken: string): Promise<Client> {
    return await this.clientRepository.updateRefreshToken(id, refreshToken);
  }

  async deleteClient(id: number): Promise<Client> {
    return await this.clientRepository.delete(id);
  }
}
