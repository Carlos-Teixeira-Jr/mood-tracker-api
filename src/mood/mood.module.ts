import { Module } from '@nestjs/common';
import { MoodController } from './mood.controller';
import { MoodService } from './mood.service';

@Module({
  providers: [MoodService],
  exports: [MoodService],
  controllers: [MoodController],
})
export class MoodModule {}
