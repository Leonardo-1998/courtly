import { AddReservationDto } from '@/dto/add.reservation.dto';
import {
  ConflictException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { PrismaService } from 'src/prisma/prisma.service';
import { MidtransService } from '@/api/midtrans/midtrans.service';
import { WalletService } from '../wallet/wallet.service';
import {
  ReservationStatus,
  TransactionType,
  TransactionStatus,
} from '@/prisma/generated/prisma/enums';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ReservationService {
  constructor(
    private prisma: PrismaService,
    private midtransService: MidtransService,
    private walletService: WalletService,
  ) {}

  async addReservation(userId: string, addReservationDto: AddReservationDto) {
    const reservationId = randomUUID();
    const total = parseInt(addReservationDto.price.replace(/\D/g, ''), 10);
    const orderId = `ORDER-${reservationId}`;

    const existingReservation = await this.prisma.reservation.findFirst({
      where: {
        date: new Date(addReservationDto.date),
        location: addReservationDto.location,
        court: addReservationDto.court,
        isDeleted: false,
        OR: [
          {
            AND: [
              {
                startTime: {
                  lt: addReservationDto.endTime,
                },
              },
              {
                startTime: {
                  gte: addReservationDto.startTime,
                },
              },
            ],
          },
          {
            AND: [
              {
                endTime: {
                  lt: addReservationDto.endTime,
                },
              },
              {
                endTime: {
                  gte: addReservationDto.startTime,
                },
              },
            ],
          },
        ],
      },
    });

    if (existingReservation) {
      throw new ConflictException('Reservasi sudah ada');
    }

    if (addReservationDto.paymentMethod === 'BALANCE') {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || user.balance < total) {
        throw new BadRequestException('Saldo tidak cukup');
      }

      await this.prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: userId },
          data: {
            balance: {
              decrement: total,
            },
          },
        });
        
        await tx.reservation.create({
          data: {
            id: reservationId,
            date: new Date(addReservationDto.date),
            location: addReservationDto.location,
            startTime: addReservationDto.startTime,
            endTime: addReservationDto.endTime,
            court: addReservationDto.court,
            price: addReservationDto.price,
            status: ReservationStatus.PAID,
            paymentMethod: 'BALANCE',
            user: {
              connect: {
                id: userId,
              },
            },
          },
        });

        await this.walletService.createTransaction({
          userId,
          amount: -total,
          type: TransactionType.RESERVATION_PAYMENT,
          status: TransactionStatus.SUCCESS,
          referenceId: reservationId,
          description: `Pembayaran reservasi di ${addReservationDto.location} - ${addReservationDto.court}`,
        });
      });

      return null; // Return null if paid with saldo
    }

    const transactionToken = await this.midtransService.payment(total, orderId);

    await this.prisma.reservation.create({
      data: {
        id: reservationId,
        date: new Date(addReservationDto.date),
        location: addReservationDto.location,
        startTime: addReservationDto.startTime,
        endTime: addReservationDto.endTime,
        court: addReservationDto.court,
        price: addReservationDto.price,
        paymentMethod: 'MIDTRANS',
        user: {
          connect: {
            id: userId,
          },
        },
        midtrans: {
          create: {
            orderId: orderId,
            grossAmount: total,
            token: transactionToken,
          },
        },
      },
    });

    return transactionToken;
  }

  async getUserReservations(userId: string, status?: string) {
    const statuses = status
      ? status.split(',').map((status) => status.toUpperCase())
      : undefined;
    return this.prisma.reservation.findMany({
      where: {
        userId,
        isDeleted: false,
        ...(statuses && {
          status: { in: statuses as ReservationStatus[] },
        }),
      },
      include: {
        midtrans: true,
      },
      orderBy: [
        {
          date: 'asc',
        },
        {
          startTime: 'asc',
        },
      ],
    });
  }

  async getUserReservationHistory(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.reservation.findMany({
        where: {
          userId,
          isDeleted: false,
        },
        include: {
          midtrans: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.reservation.count({
        where: {
          userId,
          isDeleted: false,
        },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAllReservations(status?: string) {
    const statuses = status
      ? status.split(',').map((status) => status.toUpperCase())
      : undefined;
    return this.prisma.reservation.findMany({
      where: {
        isDeleted: false,
        ...(statuses && {
          status: { in: statuses as ReservationStatus[] },
        }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAllReservationsByCourtAndDate(location: string, date: string) {
    return this.prisma.reservation.findMany({
      where: {
        location: location,
        date: new Date(date),
        isDeleted: false,
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async cancelReservation(id: string) {
    return this.prisma.reservation.update({
      where: { id },
      data: {
        isDeleted: true,
        status: ReservationStatus.CANCELLED,
      },
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredReservations() {
    const now = new Date();

    const pendingReservations = await this.prisma.reservation.findMany({
      where: {
        status: ReservationStatus.PENDING,
        isDeleted: false,
      },
    });

    const expiredIds: string[] = [];

    for (const res of pendingReservations) {
      const [hour, minute] = res.startTime.split('.').map(Number);
      const reservationStart = new Date(res.date);
      reservationStart.setHours(hour, minute, 0, 0);

      // Jika waktu sekarang sudah melewati waktu mulai reservasi
      if (now > reservationStart) {
        expiredIds.push(res.id);
      }
    }

    if (expiredIds.length > 0) {
      await this.prisma.reservation.updateMany({
        where: { id: { in: expiredIds } },
        data: {
          status: ReservationStatus.CANCELLED,
        },
      });
      console.log(
        `[Cron] ${expiredIds.length} reservasi dihanguskan karena melewati jadwal.`,
      );
    }
  }
}
