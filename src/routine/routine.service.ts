import { Injectable, NotFoundException } from '@nestjs/common';
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

  async update(userId: string, id: string, body: any) {
    const routine = await this.prisma.routineItem.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!routine) {
      throw new NotFoundException('Item de rotina não encontrado.');
    }

    return this.prisma.routineItem.update({
      where: {
        id,
      },
      data: {
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.active !== undefined ? { active: body.active } : {}),
      },
    });
  }

  async remove(id: string) {
    return this.prisma.routineItem.update({
      where: { id },
      data: {
        active: false,
        deletedAt: new Date(),
      },
    });
  }
}

export default RoutineService;
