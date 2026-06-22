import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoutineService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    data: {
      title: string;
    },
  ) {
    return this.prisma.routineItem.create({
      data: {
        userId,
        title: data.title,
      },
    });
  }

  async getUserRoutines(userId: string) {
    const routines = await this.prisma.routineItem.findMany({
      where: {
        userId,
        active: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return {
      routines,
    };
  }
}

export default RoutineService;
