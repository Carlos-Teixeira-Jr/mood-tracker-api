import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
class CheckinService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, body: any) {
    const { date, mood, sleep, medications = [], routines = [] } = body;

    const checkinDate = new Date(`${date}T12:00:00.000Z`);

    return this.prisma.checkin.upsert({
      where: {
        userId_date: {
          userId,
          date: checkinDate,
        },
      },

      create: {
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
                  hours: Number(sleep.hours),
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

      update: {
        mood: {
          upsert: {
            create: {
              score: mood.score,
              anxiety: mood.anxiety,
              energy: mood.energy,
              irritability: mood.irritability,
              notes: mood.notes || null,
            },
            update: {
              score: mood.score,
              anxiety: mood.anxiety,
              energy: mood.energy,
              irritability: mood.irritability,
              notes: mood.notes || null,
            },
          },
        },

        ...(sleep
          ? {
              sleep: {
                upsert: {
                  create: {
                    hours: Number(sleep.hours),
                    quality: sleep.quality || null,
                    notes: sleep.notes || null,
                  },
                  update: {
                    hours: Number(sleep.hours),
                    quality: sleep.quality || null,
                    notes: sleep.notes || null,
                  },
                },
              },
            }
          : {}),

        medicationLogs: {
          deleteMany: {},
          create: medications.map((item) => ({
            medicationId: item.medicationId,
            takenAt: item.takenAt ? new Date(item.takenAt) : checkinDate,
          })),
        },

        routineLogs: {
          deleteMany: {},
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
}

export default CheckinService;
