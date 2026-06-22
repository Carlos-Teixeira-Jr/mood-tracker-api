import { Module } from '@nestjs/common';
import RoutineService from './routine.service';
import RoutineController from './routine.controller';

@Module({
  providers: [RoutineService],
  exports: [RoutineService],
  controllers: [RoutineController],
})
export class RoutineModule {}
