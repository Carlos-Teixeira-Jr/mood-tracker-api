import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import CheckinService from './checkin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('checkin')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() body: { date: string }) {
    const userId = req.user.userId;

    return this.checkinService.create(userId, body);
  }
}

export default CheckinController;
