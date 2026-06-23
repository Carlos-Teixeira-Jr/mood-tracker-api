import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  getProfile(@Request() req) {
    const userId = req.user.userId;
    return this.profileService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('')
  updateProfile(@Request() req, @Body() body: { name: string }) {
    const userId = req.user.userId;
    return this.profileService.updateProfile(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('email')
  updateEmail(@Request() req, @Body() body: { email: string }) {
    const userId = req.user.userId;
    return this.profileService.updateEmail(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password')
  updatePassword(
    @Request() req,
    @Body()
    body: {
      currentPassword: string;
      newPassword: string;
    },
  ) {
    const userId = req.user.userId;
    return this.profileService.updatePassword(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('')
  deleteProfile(@Request() req) {
    const userId = req.user.userId;
    return this.profileService.deleteProfile(userId);
  }
}
