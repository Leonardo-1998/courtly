import { Module } from '@nestjs/common';
import { MidtransModule } from '../midtrans/midtrans.module';
import { WalletModule } from '../wallet/wallet.module';
import { TopupController } from './topup.controller';
import { TopupService } from './topup.service';

@Module({
  imports: [MidtransModule, WalletModule],
  controllers: [TopupController],
  providers: [TopupService],
})
export class TopupModule {}
