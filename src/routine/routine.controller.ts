import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Request() req, @Param('id') id: string, @Body() body: any) {
    const userId = req.user.userId;

    return this.routineService.update(userId, id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.routineService.remove(id);
  }
}

export default RoutineController;
