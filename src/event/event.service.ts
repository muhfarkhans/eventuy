import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { EventRepository } from './event.repository';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateEventDto } from './dto/update.dto';
import { DatatableParams } from 'types';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private cloudinary: CloudinaryService,
  ) {}

  async getEvent(params: DatatableParams): Promise<{
    data: Event[];
    total: number;
  }> {
    const [data, total] = await Promise.all([
      this.eventRepository.findAll(params),
      this.eventRepository.getTotal(params),
    ]);

    return { data, total };
  }

  async createEvent(
    dto: CreateEventDto,
    thumbnail: Express.Multer.File | undefined,
    logo: Express.Multer.File | undefined,
    clientId: number,
    adminId: number = 0,
  ): Promise<Event> {
    let thumbnailName = 'default.jpg';
    let logoName = 'default.jpg';

    if (thumbnail) {
      const image = await this.cloudinary.uploadImage(thumbnail).catch(() => {
        throw new BadRequestException('Invalid file type.');
      });

      thumbnailName = image.secure_url;
    }

    if (logo) {
      const image = await this.cloudinary.uploadImage(logo).catch(() => {
        throw new BadRequestException('Invalid file type.');
      });
      logoName = image.secure_url;
    }

    const event: Event = {
      clientId: clientId,
      title: dto.title,
      description: dto.description,
      thumbnail: thumbnailName,
      logo: logoName,
      startTime: dto.startTime,
      endTime: dto.endTime,
      location: dto.location,
      googleMaps: dto.googleMaps,
    };

    if (adminId != 0) event.adminId = adminId;

    const create = await this.eventRepository.create(event);

    return create;
  }

  async updateEvent(
    id: number,
    dto: UpdateEventDto,
    thumbnail: Express.Multer.File | undefined,
    logo: Express.Multer.File | undefined,
    clientId: number,
    isAdmin: boolean,
  ) {
    const findById = await this.eventRepository.findById(id);
    if (!findById) throw new BadRequestException('Data not found.');
    if (findById.clientId !== clientId) {
      if (!isAdmin) throw new ForbiddenException('Forbidden');
    }

    console.log('thumbnail', thumbnail);

    let thumbnailName = findById.thumbnail;
    let logoName = findById.logo;

    if (thumbnail) {
      const image = await this.cloudinary.uploadImage(thumbnail).catch(() => {
        throw new BadRequestException('Invalid file type.');
      });

      if (image.secure_url != null) {
        await this.cloudinary.deleteImages([thumbnailName]);
        thumbnailName = image.secure_url;
      }
    }

    if (logo) {
      const image = await this.cloudinary.uploadImage(logo).catch(() => {
        throw new BadRequestException('Invalid file type.');
      });

      if (image.secure_url != null) {
        await this.cloudinary.deleteImages([logoName]);
        logoName = image.secure_url;
      }
    }

    const event: Event = {
      clientId: findById.clientId,
      title: dto.title,
      description: dto.description,
      thumbnail: thumbnailName,
      logo: logoName,
      startTime: dto.startTime,
      endTime: dto.endTime,
      location: dto.location,
      googleMaps: dto.googleMaps,
      isAccepted: 0,
      isPublished: 0,
    };

    if (isAdmin) event.adminId = clientId;

    const update = await this.eventRepository.update(id, event);

    return update;
  }

  async acceptEvent(id: number) {
    const findById = await this.eventRepository.findById(id);
    if (!findById) throw new BadRequestException('Data not found.');

    const event = await this.eventRepository.findById(id);
    if (event.isAccepted == 1) {
      return event;
    }

    event.isAccepted = 1;
    event.isPublished = 1;
    event.publishedAt = new Date();

    await this.eventRepository.update(id, event);
    return event;
  }

  async rejectEvent(id: number, rejectReason: string) {
    const findById = await this.eventRepository.findById(id);
    if (!findById) throw new BadRequestException('Data not found.');

    const event = await this.eventRepository.findById(id);
    if (event.isAccepted == 0) {
      return event;
    }

    event.isAccepted = 0;
    event.isPublished = 0;
    event.publishedAt = null;
    event.rejectReason = rejectReason;

    await this.eventRepository.update(id, event);
    return event;
  }

  async publishEvent(id: number) {
    const findById = await this.eventRepository.findById(id);
    if (!findById) throw new BadRequestException('Data not found.');

    if (findById.isAccepted == 0)
      throw new BadRequestException('Need to accepted first');

    const event = await this.eventRepository.findById(id);
    if (event.isPublished == 1) {
      return event;
    }

    event.isPublished = 1;
    event.publishedAt = new Date();

    await this.eventRepository.update(id, event);
    return event;
  }

  async unPublishEvent(id: number) {
    const findById = await this.eventRepository.findById(id);
    if (!findById) throw new BadRequestException('Data not found.');

    const event = await this.eventRepository.findById(id);
    if (event.isPublished == 0) {
      return event;
    }

    event.isPublished = 0;

    await this.eventRepository.update(id, event);
    return event;
  }

  async findEventById(id: number): Promise<Event> {
    return await this.eventRepository.findById(id);
  }

  async findEventByClient(clientId: number): Promise<Event[]> {
    return await this.eventRepository.findByClient(clientId);
  }

  async deleteEvent(id: number): Promise<Event> {
    const event = await this.eventRepository.delete(id);
    await this.cloudinary.deleteImages([event.thumbnail, event.logo]);

    return event;
  }
}
