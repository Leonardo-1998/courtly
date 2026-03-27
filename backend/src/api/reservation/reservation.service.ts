import { AddReservationDto } from '@/dto/add.reservation.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { PrismaService } from 'src/prisma/prisma.service';
import { MidtransService } from '@/api/midtrans/midtrans.service';
import { ReservationStatus } from '@/prisma/generated/prisma/enums';

@Injectable()
export class ReservationService {
  constructor(
    private prisma: PrismaService,
    private midtransService: MidtransService,
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

    const transactionToken = await this.midtransService.payment(
      addReservationDto,
      orderId,
    );

    await this.prisma.reservation.create({
      data: {
        id: reservationId,
        date: new Date(addReservationDto.date),
        location: addReservationDto.location,
        startTime: addReservationDto.startTime,
        endTime: addReservationDto.endTime,
        court: addReservationDto.court,
        price: addReservationDto.price,
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
      orderBy: {
        createdAt: 'desc',
      },
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
}
