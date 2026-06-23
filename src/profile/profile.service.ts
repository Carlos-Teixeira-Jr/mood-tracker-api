import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }

  async updateProfile(userId: string, data: { name: string }) {
    if (!data.name?.trim()) {
      throw new BadRequestException('Nome é obrigatório');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name.trim(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }

  async updateEmail(userId: string, data: { email: string }) {
    if (!data.email?.trim()) {
      throw new BadRequestException('Email é obrigatório');
    }

    const emailAlreadyExists = await this.prisma.user.findUnique({
      where: { email: data.email.trim() },
    });

    if (emailAlreadyExists && emailAlreadyExists.id !== userId) {
      throw new BadRequestException('Este email já está em uso');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        email: data.email.trim(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }

  async updatePassword(
    userId: string,
    data: {
      currentPassword: string;
      newPassword: string;
    },
  ) {
    if (!data.currentPassword || !data.newPassword) {
      throw new BadRequestException(
        'Senha atual e nova senha são obrigatórias',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const passwordMatches = await bcrypt.compare(
      data.currentPassword,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    const newPasswordHash = await bcrypt.hash(data.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    return {
      message: 'Senha alterada com sucesso',
    };
  }

  async deleteProfile(userId: string) {
    const deletedAt = new Date();

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: {
          isActive: false,
          deletedAt,
          email: `deleted_${userId}_${user.email}`,
        },
      }),

      this.prisma.medication.updateMany({
        where: {
          userId,
          deletedAt: null,
        },
        data: {
          active: false,
          deletedAt,
        },
      }),

      this.prisma.routineItem.updateMany({
        where: {
          userId,
          deletedAt: null,
        },
        data: {
          active: false,
          deletedAt,
        },
      }),

      this.prisma.checkin.updateMany({
        where: {
          userId,
          deletedAt: null,
        },
        data: {
          deletedAt,
        },
      }),
    ]);

    return {
      message: 'Conta excluída com sucesso',
    };
  }
}
