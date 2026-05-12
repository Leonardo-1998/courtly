import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { TransactionType, TransactionStatus } from '@/prisma/generated/prisma/enums';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(data: {
    userId: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    referenceId?: string;
    description?: string;
  }) {
    return this.prisma.balanceTransaction.create({
      data: {
        userId: data.userId,
        amount: data.amount,
        type: data.type,
        status: data.status,
        referenceId: data.referenceId,
        description: data.description,
      },
    });
  }

  async updateTransactionStatus(referenceId: string, status: TransactionStatus) {
    return this.prisma.balanceTransaction.updateMany({
      where: { referenceId },
      data: { status },
    });
  }

  async getHistory(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.balanceTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.balanceTransaction.count({
        where: { userId },
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
}
