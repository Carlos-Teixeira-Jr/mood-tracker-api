import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoodModule } from './mood/mood.module';

@Module({
  imports: [PrismaModule, HealthModule, AuthModule, UsersModule, MoodModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
