import { AddReservationDto } from '@/dto/add.reservation.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import {
  MidtransStatus,
  ReservationStatus,
} from '@/prisma/generated/prisma/enums';
import midtransClient from 'midtrans-client';

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

import { NotificationDto } from '@/dto/midtrans.notification';

@Injectable()
export class MidtransService {
  constructor(private prisma: PrismaService) {}

  async payment(addReservationDto: AddReservationDto, orderId: string) {
    const total = parseInt(addReservationDto.price.replace(/\D/g, ''), 10);
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: total,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    return transaction.token;
  }

  async notification(notificationDto: NotificationDto) {
    console.log(notificationDto);
    const { order_id, transaction_status } = notificationDto;

    const midtransRecord = await this.prisma.midtrans.findFirst({
      where: { orderId: order_id },
      include: { reservation: true },
    });

    if (!midtransRecord) {
      throw new NotFoundException('Transaction not found');
    }

    // 1. Update Midtrans Status
    await this.prisma.midtrans.update({
      where: { id: midtransRecord.id },
      data: { status: transaction_status },
    });

    // 2. Map Midtrans Status to Reservation Status
    let reservationStatus: ReservationStatus = ReservationStatus.PENDING;
    if (transaction_status === MidtransStatus.SETTLEMENT) {
      reservationStatus = ReservationStatus.PAID;
    } else if (
      (
        [
          MidtransStatus.EXPIRE,
          MidtransStatus.DENY,
          MidtransStatus.CANCEL,
        ] as MidtransStatus[]
      ).includes(transaction_status)
    ) {
      reservationStatus = ReservationStatus.CANCELLED;
    }

    // 3. Update all associated Reservations
    if (midtransRecord.reservation.length > 0) {
      await this.prisma.reservation.updateMany({
        where: { midtransId: midtransRecord.id },
        data: { status: reservationStatus },
      });
    }

    return {
      order_id,
      transaction_status,
      message: 'Notification processed and statuses updated',
    };
  }
}
