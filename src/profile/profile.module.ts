import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  providers: [ProfileService],
  exports: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
