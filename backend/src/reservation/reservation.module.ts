import { Module } from '@nestjs/common';
import { MidtransModule } from '../midtrans/midtrans.module';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

@Module({
  imports: [MidtransModule],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
