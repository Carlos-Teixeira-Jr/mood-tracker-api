import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserWithPassword } from '../users/types/user-with-password.type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(data: { email: string; password: string; name?: string }) {
    const existingUser = await this.usersService.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.usersService.create({
      email: data.email,
      passwordHash,
      name: data.name,
    });

    return this.generateToken(user.id, user.email);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user.id, user.email);
  }

  private generateToken(userId: string, email: string) {
    return {
      access_token: this.jwtService.sign({
        sub: userId,
        email,
      }),
    };
  }
}
