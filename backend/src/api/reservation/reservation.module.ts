import { Module } from '@nestjs/common';
import { MidtransModule } from '../midtrans/midtrans.module';
import { WalletModule } from '../wallet/wallet.module';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

@Module({
  imports: [MidtransModule, WalletModule],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
