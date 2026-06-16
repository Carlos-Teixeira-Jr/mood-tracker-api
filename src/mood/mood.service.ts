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
    });
  }

  async findByUser(userId: string) {
    return this.prisma.moodEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUserAndDate(userId: string, date: Date) {
    return this.prisma.moodEntry.findFirst({
      where: {
        userId,
        createdAt: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
      },
    });
  }

  async create(userId: string, dto: CreateMoodDto) {
    return this.prisma.moodEntry.create({
      data: {
        userId,
        date: new Date(dto.date),
        score: dto.score,
        anxiety: dto.anxiety,
        energy: dto.energy,
        irritability: dto.irritability,
        notes: dto.notes,
      },
    });
  }

  async update(id: string, dto: UpdateMoodDto) {
    return this.prisma.moodEntry.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.moodEntry.delete({
      where: { id },
    });
  }
}
