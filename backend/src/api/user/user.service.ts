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

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: loginDto.identifier }, { username: loginDto.identifier }],
      },
    });

    if (!user || (await comparePassword(user.password, loginDto.password))) {
      throw new BadRequestException('User atau Email atau Password salah');
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
}
