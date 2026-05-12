import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { LoginDto } from '../../dto/login.dto';
import { RegisterDto } from '../../dto/register.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@/prisma/generated/prisma/client';

import { comparePassword, hashPassword } from '@/utils/bcrypt.util';
import { generateToken } from '@/utils/jwt.util';

import { GoogleService } from './google.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private googleService: GoogleService,
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: loginDto.identifier }, { username: loginDto.identifier }],
      },
    });

    if (
      !user ||
      !user.password ||
      !(await comparePassword(loginDto.password, user.password))
    ) {
      throw new BadRequestException("User atau Email atau Password salah");
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const token = generateToken(payload);

    return token;
  }

  async register(registerDto: RegisterDto): Promise<User | null> {
    const userEmail = await this.prisma.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });

    if (userEmail) {
      throw new ConflictException('Email already taken');
    }
    const userUsername = await this.prisma.user.findUnique({
      where: {
        username: registerDto.username,
      },
    });

    if (userUsername) {
      throw new ConflictException('Username already taken');
    }

    const hashedPassword = await hashPassword(registerDto.password);
    const createUser = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        username: registerDto.username,
      },
    });
    return createUser;
  }

  async getProfile(
    userId: string,
  ): Promise<{ balance: number; username: string } | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException('User tidak ditemukan');
    }

    return {
      balance: user.balance,
      username: user.username,
    };
  }

  async loginWithGoogle(credential: string): Promise<string> {
    const payload = await this.googleService.verifyToken(credential);

    if (!payload.email) {
      throw new BadRequestException("Google account must have an email");
    }

    let user = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      // Create new user if not exists
      // Generate a random username if not available
      let baseUsername =
        payload.name?.replace(/\s+/g, "").toLowerCase() ||
        payload.email.split("@")[0];

      // Ensure username is at least 3 characters
      if (baseUsername.length < 3) {
        baseUsername = baseUsername.padEnd(3, "0");
      }

      let username = baseUsername;
      let counter = 1;

      // Ensure username uniqueness
      while (await this.prisma.user.findUnique({ where: { username } })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      user = await this.prisma.user.create({
        data: {
          email: payload.email,
          username: username,
          googleId: payload.sub,
          // Password remains null for Google-only accounts
        },
      });
    } else if (!user.googleId) {
      // Link Google account if email matches but googleId is missing
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId: payload.sub },
      });
    }

    const tokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    return generateToken(tokenPayload);
  }
}
