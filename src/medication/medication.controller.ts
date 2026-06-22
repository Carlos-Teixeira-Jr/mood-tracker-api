import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
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
}
