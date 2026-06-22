import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

@Injectable()
export class MedicationService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.medication.findUnique({
      where: { id },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.medication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUserAndDate(userId: string, date: Date) {
    return this.prisma.medication.findFirst({
      where: {
        userId,
        createdAt: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
      },
    });
  }

  async create(userId: string, dto: CreateMedicationDto) {
    return this.prisma.medication.create({
      data: {
        userId,
        name: dto.name,
        dosage: dto.dosage,
        active: dto.active,
      },
    });
  }

  async update(id: string, dto: UpdateMedicationDto) {
    return this.prisma.medication.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.medication.delete({
      where: { id },
    });
  }

  async getUserMedications(userId: string) {
    return this.prisma.medication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
