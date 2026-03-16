import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@/common/guards/auth.guard';
import { ReservationService } from './reservation.service';
import { ApiResponse } from '@/common/response.interface';
import { successResponse } from '@/common/api.response';
import { AddReservationDto } from '@/dto/add.reservation.dto';
import { User } from '@/common/decorators/user.decorator';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post('add')
  @UseGuards(AuthGuard)
  async addReservation(
    @User('id') userId: string,
    @Body() addReservationDto: AddReservationDto,
  ): Promise<ApiResponse | null> {
    const reservation = await this.reservationService.addReservation(
      userId,
      addReservationDto,
    );

    return successResponse(reservation, 'Berhasil menambahkan reservasi');
  }

  @Get('my-reservations')
  @UseGuards(AuthGuard)
  async getMyReservations(
    @User('id') userId: string,
    @Query('status') status?: string,
  ): Promise<ApiResponse | null> {
    const reservations = await this.reservationService.getUserReservations(
      userId,
      status,
    );
    return successResponse(reservations, 'Berhasil mengambil data reservasi');
  }

  @Get('all-reservations')
  async getAllReservations(
    @Query('status') status?: string,
  ): Promise<ApiResponse | null> {
    const reservations = await this.reservationService.getAllReservations(status);
    return successResponse(reservations, 'Berhasil mengambil data reservasi');
  }

  @Get('reservations')
  async getAllReservationsByCourtAndDate(
    @Query() query: { location: string; date: string },
  ): Promise<ApiResponse | null> {
    const { location, date } = query;
    const reservations =
      await this.reservationService.getAllReservationsByCourtAndDate(
        location,
        date,
      );
    return successResponse(reservations, 'Berhasil mengambil data reservasi');
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async cancelReservation(@Param('id') id: string): Promise<ApiResponse | null> {
    const reservation = await this.reservationService.cancelReservation(id);
    return successResponse(reservation, 'Berhasil membatalkan reservasi');
  }
}
