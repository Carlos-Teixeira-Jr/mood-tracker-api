import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import DashboardService from './dashboard.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('dashboard')
class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getDashboard(@Request() req, @Query('period') period = 'week') {
    console.log('period recebido:', period);
    const userId = req.user.userId;
    return this.dashboardService.getDashboard(userId, period);
  }
}

export default DashboardController;
