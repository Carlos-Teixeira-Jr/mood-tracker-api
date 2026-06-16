import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MoodService } from './mood.service';

@Controller('mood')
export class MoodController {
  constructor(private readonly moodService: MoodService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async me(@Request() req) {
    console.log(req.headers);
    const userId = req.user.userId;

    return this.moodService.findById(userId);
  }
}
