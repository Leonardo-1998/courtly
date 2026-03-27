import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { MidtransService } from './midtrans.service';
import { ApiResponse } from '@/common/response.interface';
import { successResponse } from '@/common/api.response';
import { AddReservationDto } from '@/dto/add.reservation.dto';
import { User } from '@/common/decorators/user.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';

import { NotificationDto } from '@/dto/midtrans.notification';
import { randomUUID } from 'crypto';

@Controller('midtrans')
export class MidtransController {
  constructor(private readonly midtransService: MidtransService) {}

  @Post('payment')
  @UseGuards(AuthGuard)
  async payment(
    @Body() addReservationDto: AddReservationDto,
  ): Promise<ApiResponse | null> {
    const reservationId = randomUUID();
    const payment = await this.midtransService.payment(
      addReservationDto,
      reservationId,
    );

    return successResponse(payment, 'Berhasil membuat payment');
  }

  @Post('notification')
  async notification(
    @Body() notificationDto: NotificationDto,
  ): Promise<ApiResponse | null> {
    console.log(notificationDto);
    const payment = await this.midtransService.notification(notificationDto);

    return successResponse(payment, 'Berhasil memproses notification');
  }
}
