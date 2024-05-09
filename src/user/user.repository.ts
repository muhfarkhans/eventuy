import { Injectable } from '@nestjs/common';
import { IUserRepository } from './user.repository.interface';
import { User, UserSafe } from './user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { DatatableParams } from 'types';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  create(data: User): Promise<User> {
    return this.prisma.user.create({ data });
  }

  findAll(params: DatatableParams): Promise<UserSafe[]> {
    const skip = (params.page - 1) * params.per_page;

    const whereCondition: Prisma.UserWhereInput = {
      OR: [
        { name: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
      ],
    };

    const orderByOption = { [params.order_by]: params.sort_by };

    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
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
    const whereCondition: Prisma.UserWhereInput = {
      OR: [
        { name: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
      ],
    };

    return this.prisma.user.count({
      where: whereCondition,
    });
  }

  findById(id: number): Promise<User> {
    return this.prisma.user.findFirst({ where: { id } });
  }

  findByEmail(email: string): Promise<User> {
    return this.prisma.user.findFirst({ where: { email } });
  }

  update(id: number, data: User): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  updateRefreshToken(id: number, refreshToken: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        refreshToken,
      },
    });
  }

  delete(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
