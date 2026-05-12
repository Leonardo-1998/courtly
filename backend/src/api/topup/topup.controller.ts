import { Controller, UseGuards, Body, Post, Get } from '@nestjs/common';
import { TopupService } from './topup.service';
import { AuthGuard } from '@/common/guards/auth.guard';
import { ApiResponse } from '@/common/response.interface';
import { successResponse } from '@/common/api.response';
import { randomUUID } from 'crypto';
import { User } from '@/common/decorators/user.decorator';
import { TopupDto } from '@/dto/topup.dtop';

@Controller('topup')
export class TopupController {
  constructor(private readonly topupService: TopupService) {}

  @Post('payment')
  @UseGuards(AuthGuard)
  async payment(
    @Body() topupDto: TopupDto,
    @User('id') userId: string,
  ): Promise<ApiResponse | null> {
    const orderId = randomUUID();
    const topUpToken = await this.topupService.payment(
      topupDto.amount,
      orderId,
      userId,
    );

    return successResponse(topUpToken, 'Berhasil membuat requestpayment');
  }

  @Get('history')
  @UseGuards(AuthGuard)
  async history(@User('id') userId: string): Promise<ApiResponse | null> {
    const history = await this.topupService.history(userId);

    return successResponse(history, 'Berhasil mendapatkan riwayat topup');
  }
}
