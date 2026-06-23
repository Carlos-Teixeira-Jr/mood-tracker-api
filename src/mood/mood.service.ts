import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMoodDto } from './dto/create-mood.dto';
import { UpdateMoodDto } from './dto/update-mood.dto';

@Injectable()
export class MoodService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.moodEntry.findUnique({
      where: { id },
      include: {
        checkin: true,
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.moodEntry.findMany({
      where: {
        checkin: {
          userId,
        },
      },
      include: {
        checkin: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByUserAndDate(userId: string, date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return this.prisma.moodEntry.findFirst({
      where: {
        checkin: {
          userId,
          date: {
            gte: start,
            lte: end,
          },
        },
      },
      include: {
        checkin: true,
      },
    });
  }

  async create(userId: string, dto: CreateMoodDto) {
    const checkinDate = new Date(`${dto.date}T12:00:00.000Z`);

    return this.prisma.checkin.create({
      data: {
        userId,
        date: checkinDate,
        mood: {
          create: {
            score: dto.score,
            anxiety: dto.anxiety,
            energy: dto.energy,
            irritability: dto.irritability,
            notes: dto.notes,
          },
        },
      },
      include: {
        mood: true,
      },
    });
  }

  async update(id: string, dto: UpdateMoodDto) {
    return this.prisma.moodEntry.update({
      where: { id },
      data: {
        score: dto.score,
        anxiety: dto.anxiety,
        energy: dto.energy,
        irritability: dto.irritability,
        notes: dto.notes,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.moodEntry.delete({
      where: { id },
    });
  }

  async findToday(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.prisma.moodEntry.findFirst({
      where: {
        checkin: {
          userId,
          date: {
            gte: today,
            lt: tomorrow,
          },
        },
      },
      include: {
        checkin: true,
      },
      orderBy: {
        checkin: {
          date: 'desc',
        },
      },
    });
  }

  async findRecent(userId: string) {
    return this.prisma.moodEntry.findMany({
      where: {
        checkin: {
          userId,
        },
      },
      include: {
        checkin: true,
      },
      orderBy: {
        checkin: {
          date: 'desc',
        },
      },
      take: 5,
    });
  }

  async findHistory(userId: string) {
    return this.prisma.moodEntry.findMany({
      where: {
        checkin: {
          userId,
        },
      },
      include: {
        checkin: true,
      },
      orderBy: {
        checkin: {
          date: 'desc',
        },
      },
    });
  }
}
