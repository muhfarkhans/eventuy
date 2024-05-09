import { Injectable } from '@nestjs/common';
import { IAdminRepository } from './admin.repository.interface';
import { Admin, AdminSafe } from './admin.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { DatatableParams } from 'types';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminRepository implements IAdminRepository {
  constructor(private prisma: PrismaService) {}

  create(data: Admin): Promise<Admin> {
    return this.prisma.admin.create({ data });
  }

  findAll(params: DatatableParams): Promise<AdminSafe[]> {
    const skip = (params.page - 1) * params.per_page;

    const whereCondition: Prisma.AdminWhereInput = {
      OR: [
        { name: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
      ],
    };

    const orderByOption = { [params.order_by]: params.sort_by };

    return this.prisma.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
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
    const whereCondition: Prisma.AdminWhereInput = {
      OR: [
        { name: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
      ],
    };

    return this.prisma.admin.count({
      where: whereCondition,
    });
  }

  findById(id: number): Promise<Admin> {
    return this.prisma.admin.findFirst({ where: { id } });
  }

  findByEmail(email: string): Promise<Admin> {
    return this.prisma.admin.findFirst({ where: { email } });
  }

  update(id: number, data: Admin): Promise<Admin> {
    return this.prisma.admin.update({ where: { id }, data });
  }

  updateRefreshToken(id: number, refreshToken: string): Promise<Admin> {
    return this.prisma.admin.update({
      where: { id },
      data: {
        refreshToken,
      },
    });
  }

  delete(id: number): Promise<Admin> {
    return this.prisma.admin.delete({ where: { id } });
  }
}
