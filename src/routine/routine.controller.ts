import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import RoutineService from './routine.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('routine')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() body: { title: string }) {
    const userId = req.user.userId;

    return this.routineService.create(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getUserRoutines(@Request() req) {
    const userId = req.user.userId;

    return this.routineService.getUserRoutines(userId);
  }
}

export default RoutineController;
