import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { UsersService } from 'src/users/users.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
    private readonly usersService: UsersService,
  ) {}

  @Get('database')
  async database() {
    return this.healthService.database();
  }

  @Get('users-test')
  async usersTest() {
    return this.usersService.create({
      name: 'Carlos',
      email: 'carlos@test.com',
      passwordHash: '123',
    });
  }
}
