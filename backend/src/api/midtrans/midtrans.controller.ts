import { Controller, Post, Body } from '@nestjs/common';
import { MidtransService } from './midtrans.service';
import { ApiResponse } from '@/common/response.interface';
import { successResponse } from '@/common/api.response';

import { NotificationDto } from '@/dto/midtrans.notification';

@Controller('midtrans')
export class MidtransController {
  constructor(private readonly midtransService: MidtransService) {}

  @Post('notification')
  async notification(
    @Body() notificationDto: NotificationDto,
  ): Promise<ApiResponse | null> {
    const payment = await this.midtransService.notification(notificationDto);

    return successResponse(payment, 'Berhasil memproses notification');
  }
}
