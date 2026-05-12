import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { MidtransService } from '@/api/midtrans/midtrans.service';
import { WalletService } from '../wallet/wallet.service';
import {
  PaymentMethod,
  TopupStatus,
  TransactionType,
  TransactionStatus,
} from '@/prisma/generated/prisma/enums';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TopupService {
  constructor(
    private prisma: PrismaService,
    private midtransService: MidtransService,
    private walletService: WalletService,
  ) {}

  async payment(gross_amount: number, orderId: string, userId: string) {
    const transactionToken = await this.midtransService.payment(
      gross_amount,
      orderId,
    );

    await this.prisma.topup.create({
      data: {
        id: orderId,
        amount: gross_amount,
        status: TopupStatus.PENDING,
        paymentMethod: PaymentMethod.MIDTRANS,
        user: {
          connect: {
            id: userId,
          },
        },
        midtrans: {
          create: {
            orderId: orderId,
            grossAmount: gross_amount,
            token: transactionToken,
          },
        },
      },
    });

    await this.walletService.createTransaction({
      userId,
      amount: gross_amount,
      type: TransactionType.TOPUP,
      status: TransactionStatus.PENDING,
      referenceId: orderId,
      description: `Pending top up sebesar Rp ${gross_amount.toLocaleString('id-ID')}`,
    });

    return transactionToken;
  }

  async history(userId: string) {
    const history = await this.prisma.topup.findMany({
      where: {
        userId: userId,
      },
      include: {
        midtrans: true,
      },
    });

    return history;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkPendingTopups() {
    const now = new Date();
    const pendingTopups = await this.prisma.topup.findMany({
      where: {
        status: TopupStatus.PENDING,
        createdAt: {
          lt: new Date(now.getTime() - 10 * 60 * 1000),
        },
      },
    });

    const expiredIds: string[] = [];

    for (const topup of pendingTopups) {
      if (topup.createdAt.getTime() - now.getTime() > 10 * 60 * 1000) {
        expiredIds.push(topup.id);
      }
    }
  }
}
