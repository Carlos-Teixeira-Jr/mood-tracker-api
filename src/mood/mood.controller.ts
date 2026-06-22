import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MoodService } from './mood.service';

@Controller('mood')
export class MoodController {
  constructor(private readonly moodService: MoodService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async me(@Request() req) {
    console.log('HEADERS RECEBIDOS:', req.headers);

    const userId = req.user.userId;

    return this.moodService.findById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async create(@Request() req) {
    console.log('HEADERS RECEBIDOS:', req.headers);

    const userId = req.user.userId;

    return this.moodService.create(userId, req.body);
  }

  // 🔹 últimos registros (dashboard cards)
  @UseGuards(JwtAuthGuard)
  @Get('recent')
  async findRecent(@Request() req) {
    return this.moodService.findRecent(req.user.userId);
  }

  // 🔹 humor de hoje
  @UseGuards(JwtAuthGuard)
  @Get('today')
  async findToday(@Request() req) {
    return this.moodService.findToday(req.user.userId);
  }

  // 🔹 histórico (opcional dashboard/analytics)
  @UseGuards(JwtAuthGuard)
  @Get('history')
  async findHistory(@Request() req) {
    return this.moodService.findHistory(req.user.userId);
  }
}
