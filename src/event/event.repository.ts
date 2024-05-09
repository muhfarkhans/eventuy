import { Injectable } from '@nestjs/common';
import { IEventRepository } from './event.repository.interface';
import { Event } from './event.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { DatatableParams } from 'types';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventRepository implements IEventRepository {
  constructor(private prisma: PrismaService) {}

  create(data: Event): Promise<Event> {
    return this.prisma.event.create({ data });
  }

  findAll(params: DatatableParams): Promise<Event[]> {
    const skip = (params.page - 1) * params.per_page;

    const whereCondition: Prisma.EventWhereInput = {
      OR: [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
        { location: { contains: params.search, mode: 'insensitive' } },
      ],
    };

    if (params.start_time) {
      whereCondition.AND = [
        { startTime: { gte: params.start_time, lte: params.end_time } },
      ];
    }

    const orderByOption = { [params.order_by]: params.sort_by };

    return this.prisma.event.findMany({
      select: {
        id: true,
        clientId: true,
        adminId: true,
        title: true,
        description: true,
        thumbnail: true,
        logo: true,
        startTime: true,
        endTime: true,
        location: true,
        googleMaps: true,
        isAccepted: true,
        isPublished: true,
        publishedAt: true,
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
    const whereCondition: Prisma.EventWhereInput = {
      OR: [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
        { location: { contains: params.search, mode: 'insensitive' } },
      ],
    };

    return this.prisma.event.count({
      where: whereCondition,
    });
  }

  findById(id: number): Promise<Event> {
    return this.prisma.event.findFirst({ where: { id } });
  }

  findByClient(clientId: number): Promise<Event[]> {
    return this.prisma.event.findMany({ where: { clientId } });
  }

  update(id: number, data: Event): Promise<Event> {
    return this.prisma.event.update({ where: { id }, data });
  }

  delete(id: number): Promise<Event> {
    return this.prisma.event.delete({ where: { id } });
  }
}
