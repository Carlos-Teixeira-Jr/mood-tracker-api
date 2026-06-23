import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
class CheckinService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, body: any) {
    const { date, mood, sleep, medications = [], routines = [] } = body;

    const checkinDate = new Date(`${date}T12:00:00.000Z`);

    return this.prisma.checkin.create({
      data: {
        userId,
        date: checkinDate,

        mood: {
          create: {
            score: mood.score,
            anxiety: mood.anxiety,
            energy: mood.energy,
            irritability: mood.irritability,
            notes: mood.notes || null,
          },
        },

        ...(sleep
          ? {
              sleep: {
                create: {
                  sleptAt: this.combineDateAndTime(date, sleep.sleptAt),
                  wokeAt: this.resolveWakeTime(
                    date,
                    sleep.sleptAt,
                    sleep.wokeAt,
                  ),
                  hours: this.calculateSleepHours(
                    date,
                    sleep.sleptAt,
                    sleep.wokeAt,
                  ),
                  quality: sleep.quality || null,
                  notes: sleep.notes || null,
                },
              },
            }
          : {}),

        medicationLogs: {
          create: medications.map((item) => ({
            medicationId: item.medicationId,
            takenAt: item.takenAt ? new Date(item.takenAt) : checkinDate,
          })),
        },

        routineLogs: {
          create: routines.map((item) => ({
            routineId: item.routineId,
            completedAt: item.completedAt
              ? new Date(item.completedAt)
              : checkinDate,
          })),
        },
      },
      include: {
        mood: true,
        sleep: true,
        medicationLogs: true,
        routineLogs: true,
      },
    });
  }

  private combineDateAndTime(date: string, time: string) {
    return new Date(`${date}T${time}:00.000`);
  }

  private resolveWakeTime(date: string, sleptAt: string, wokeAt: string) {
    const sleptDate = this.combineDateAndTime(date, sleptAt);
    const wokeDate = this.combineDateAndTime(date, wokeAt);

    if (wokeDate <= sleptDate) {
      wokeDate.setDate(wokeDate.getDate() + 1);
    }

    return wokeDate;
  }

  private calculateSleepHours(date: string, sleptAt: string, wokeAt: string) {
    const sleptDate = this.combineDateAndTime(date, sleptAt);
    const wokeDate = this.resolveWakeTime(date, sleptAt, wokeAt);

    return (wokeDate.getTime() - sleptDate.getTime()) / 1000 / 60 / 60;
  }
}

export default CheckinService;
