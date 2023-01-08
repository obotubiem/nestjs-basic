import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { PrismaModule } from './database/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BaseRepository } from './base-repository';

@Module({
  imports: [BookModule, UserModule, PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, BaseRepository],
})
export class AppModule {}
