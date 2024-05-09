import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';

@Module({
  imports: [JwtModule.register({}), CloudinaryModule],
  controllers: [EventController],
  providers: [EventService, EventRepository],
})
export class EventModule {}
