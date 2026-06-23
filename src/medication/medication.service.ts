import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicationDto } from './dto/create-medication.dto';

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
      where: {
        userId,
        active: true,
        deletedAt: null,
      },
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

  async update(userId: string, id: string, body: any) {
    const medication = await this.prisma.medication.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!medication) {
      throw new NotFoundException('Medicação não encontrada.');
    }

    return this.prisma.medication.update({
      where: {
        id,
      },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.dosage !== undefined ? { dosage: body.dosage || null } : {}),
        ...(body.active !== undefined ? { active: body.active } : {}),
      },
    });
  }

  async getUserMedications(userId: string) {
    return this.prisma.medication.findMany({
      where: {
        userId,
        active: true,
        deletedAt: null,
      },
      include: {
        schedules: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async remove(id: string) {
    return this.prisma.medication.update({
      where: { id },
      data: {
        active: false,
        deletedAt: new Date(),
      },
    });
  }
}
