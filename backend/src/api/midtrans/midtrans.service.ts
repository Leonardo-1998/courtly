import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import {
  MidtransStatus,
  ReservationStatus,
  TopupStatus,
} from '@/prisma/generated/prisma/enums';
import midtransClient from 'midtrans-client';

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

import { NotificationDto } from '@/dto/midtrans.notification';
import { WalletService } from '../wallet/wallet.service';
import { TransactionStatus } from '@/prisma/generated/prisma/enums';

@Injectable()
export class MidtransService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
  ) {}

  async payment(gross_amount: number, orderId: string) {
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: gross_amount,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    return transaction.token;
  }

  async notification(notificationDto: NotificationDto) {
    const { order_id, transaction_status } = notificationDto;

    const midtransRecord = await this.prisma.midtrans.findFirst({
      where: { orderId: order_id },
      include: { reservation: true, topup: true },
    });

    if (!midtransRecord) {
      throw new NotFoundException('Transaction not found');
    }

    // 1. Update Midtrans Status
    await this.prisma.midtrans.update({
      where: { id: midtransRecord.id },
      data: { status: transaction_status },
    });

    if (midtransRecord.topup.length > 0) {
      const topupData = midtransRecord.topup[0];

      let topUpStatus: TopupStatus = TopupStatus.PENDING;
      if (transaction_status === MidtransStatus.SETTLEMENT) {
        topUpStatus = TopupStatus.PAID;

        await this.prisma.$transaction(async (tx) => {
          await tx.user.update({
            where: { id: topupData.userId },
            data: {
              balance: { increment: topupData.amount },
            },
          });

          await tx.topup.update({
            where: { id: topupData.id },
            data: { status: TopupStatus.PAID },
          });

          await this.walletService.updateTransactionStatus(
            topupData.id,
            TransactionStatus.SUCCESS,
          );
        });
      } else if (
        (
          [
            MidtransStatus.CANCEL,
            MidtransStatus.DENY,
            MidtransStatus.EXPIRE,
          ] as MidtransStatus[]
        ).includes(transaction_status)
      ) {
        topUpStatus = TopupStatus.CANCELLED;

        await this.prisma.topup.update({
          where: { id: topupData.id },
          data: { status: topUpStatus },
        });

        await this.walletService.updateTransactionStatus(
          topupData.id,
          TransactionStatus.CANCELLED,
        );
      }
    }

    if (midtransRecord.reservation.length > 0) {
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
