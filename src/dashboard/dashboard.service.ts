import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  private getPeriodDays(
    startDate: Date | null,
    todayDate: Date,
    checkins: any[],
  ) {
    if (!startDate) {
      return checkins.length || 1;
    }

    const diffMs = todayDate.getTime() - startDate.getTime();
    return Math.floor(diffMs / 1000 / 60 / 60 / 24) + 1;
  }

  private getStartDateByPeriod(todayDate: Date, period: string) {
    const startDate = new Date(todayDate);

    if (period === 'day') {
      return todayDate;
    }

    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 6);
      return startDate;
    }

    if (period === 'month') {
      startDate.setDate(startDate.getDate() - 29);
      return startDate;
    }

    if (period === 'all') {
      return null;
    }

    startDate.setDate(startDate.getDate() - 6);
    return startDate;
  }

  private percentage(done: number, expected: number) {
    if (!expected) return null;
    return Number(((done / expected) * 100).toFixed(1));
  }

  async getDashboard(userId: string, period = 'week') {
    const today = this.getLocalDateString();
    const todayDate = new Date(`${today}T12:00:00.000Z`);

    const startDate = this.getStartDateByPeriod(todayDate, period);

    const checkins = await this.prisma.checkin.findMany({
      where: {
        userId,
        ...(startDate
          ? {
              date: {
                gte: startDate,
                lte: todayDate,
              },
            }
          : {}),
      },
      orderBy: {
        date: 'asc',
      },
      include: {
        mood: true,
        sleep: true,
        medicationLogs: true,
        routineLogs: true,
      },
    });

    const todayCheckin = checkins.find(
      (item) => this.toDateString(item.date) === today,
    );

    const activeMedications = await this.prisma.medication.count({
      where: {
        userId,
        active: true,
      },
    });

    const activeRoutines = await this.prisma.routineItem.count({
      where: {
        userId,
        active: true,
      },
    });

    const moodValues = checkins
      .map((item) => item.mood?.score)
      .filter((value): value is number => typeof value === 'number');

    const sleepValues = checkins
      .map((item) => item.sleep?.hours)
      .filter((value): value is number => typeof value === 'number');

    const periodDays = this.getPeriodDays(startDate, todayDate, checkins);

    const medicationsTakenInPeriod = checkins.reduce(
      (sum, item) => sum + item.medicationLogs.length,
      0,
    );

    const routinesCompletedInPeriod = checkins.reduce(
      (sum, item) => sum + item.routineLogs.length,
      0,
    );

    const medicationsExpectedInPeriod = activeMedications * periodDays;
    const routinesExpectedInPeriod = activeRoutines * periodDays;

    return {
      today: {
        date: today,
        hasCheckin: !!todayCheckin,
        mood: todayCheckin?.mood ?? null,
        sleep: todayCheckin?.sleep ?? null,
        medicationsTaken: todayCheckin?.medicationLogs.length ?? 0,
        routinesCompleted: todayCheckin?.routineLogs.length ?? 0,
      },

      summary: {
        averageMood: this.average(moodValues),
        averageSleepHours: this.average(sleepValues),

        periodDays,
        checkinsInPeriod: checkins.length,

        activeMedications,
        activeRoutines,

        medications: {
          taken: medicationsTakenInPeriod,
          expected: medicationsExpectedInPeriod,
          rate: this.percentage(
            medicationsTakenInPeriod,
            medicationsExpectedInPeriod,
          ),
        },

        routines: {
          completed: routinesCompletedInPeriod,
          expected: routinesExpectedInPeriod,
          rate: this.percentage(
            routinesCompletedInPeriod,
            routinesExpectedInPeriod,
          ),
        },
      },

      charts: {
        moodLast7Days: checkins.map((item) => ({
          date: this.toDateString(item.date),
          score: item.mood?.score ?? null,
          anxiety: item.mood?.anxiety ?? null,
          energy: item.mood?.energy ?? null,
          irritability: item.mood?.irritability ?? null,
        })),

        sleepLast7Days: checkins.map((item) => ({
          date: this.toDateString(item.date),
          hours: item.sleep?.hours ?? null,
          quality: item.sleep?.quality ?? null,
        })),
      },
    };
  }

  private average(values: number[]) {
    if (!values.length) return null;
    return Number(
      (values.reduce((sum, item) => sum + item, 0) / values.length).toFixed(1),
    );
  }

  private getLocalDateString() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private toDateString(date: Date) {
    return date.toISOString().split('T')[0];
  }
}

export default DashboardService;
