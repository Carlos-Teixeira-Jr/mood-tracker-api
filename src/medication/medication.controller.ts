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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MedicationService } from './medication.service';

@Controller('medication')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getUserMedications(@Request() req) {
    console.log('HEADERS RECEBIDOS:', req.headers);

    const userId = req.user.userId;

    return this.medicationService.getUserMedications(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async create(@Request() req) {
    console.log('HEADERS RECEBIDOS:', req.headers);

    const userId = req.user.userId;

    return this.medicationService.create(userId, req.body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getAll(@Request() req) {
    return this.medicationService.findByUser(req.user.userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Request() req, @Param('id') id: string, @Body() body: any) {
    const userId = req.user.userId;

    return this.medicationService.update(userId, id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.medicationService.remove(id);
  }
}
