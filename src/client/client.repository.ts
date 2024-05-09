import { Injectable } from '@nestjs/common';
import { IClientRepository } from './client.repository.interface';
import { Client, ClientSafe } from './client.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { DatatableParams } from 'types';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClientRepository implements IClientRepository {
  constructor(private prisma: PrismaService) {}

  create(data: Client): Promise<Client> {
    return this.prisma.userClient.create({ data });
  }

  findAll(params: DatatableParams): Promise<ClientSafe[]> {
    const skip = (params.page - 1) * params.per_page;

    const whereCondition: Prisma.UserClientWhereInput = {
      OR: [
        { name: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
        { phone: { contains: params.search, mode: 'insensitive' } },
      ],
    };

    const orderByOption = { [params.order_by]: params.sort_by };

    return this.prisma.userClient.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      where: whereCondition,
      skip: skip,
      take: params.per_page,
      orderBy: [orderByOption],
    });
  }

  getTotal(params: DatatableParams): Promise<number> {
    const whereCondition: Prisma.UserClientWhereInput = {
      OR: [
        { name: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
        { phone: { contains: params.search, mode: 'insensitive' } },
      ],
    };

    return this.prisma.userClient.count({
      where: whereCondition,
    });
  }

  findById(id: number): Promise<Client> {
    return this.prisma.userClient.findFirst({ where: { id } });
  }

  findByEmail(email: string): Promise<Client> {
    return this.prisma.userClient.findFirst({ where: { email } });
  }

  update(id: number, data: Client): Promise<Client> {
    return this.prisma.userClient.update({ where: { id }, data });
  }

  updateRefreshToken(id: number, refreshToken: string): Promise<Client> {
    return this.prisma.userClient.update({
      where: { id },
      data: {
        refreshToken,
      },
    });
  }

  delete(id: number): Promise<Client> {
    return this.prisma.userClient.delete({ where: { id } });
  }
}
