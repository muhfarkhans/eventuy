import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthAdminModule } from './auth-admin/auth-admin.module';
import { AdminModule } from './admin/admin.module';
import { ClientModule } from './client/client.module';
import { AuthClientModule } from './auth-client/auth-client.module';
import { UserModule } from './user/user.module';
import { AuthUserModule } from './auth-user/auth-user.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { EventModule } from './event/event.module';
import { EventTicketModule } from './event-ticket/event-ticket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CloudinaryModule,
    AdminModule,
    AuthAdminModule,
    ClientModule,
    AuthClientModule,
    UserModule,
    AuthUserModule,
    EventModule,
    EventTicketModule,
  ],
})
export class AppModule {}
