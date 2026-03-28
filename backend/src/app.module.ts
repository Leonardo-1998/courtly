import { Module } from '@nestjs/common';
import { UserModule } from './api/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReservationModule } from './api/reservation/reservation.module';
import { MidtransModule } from './api/midtrans/midtrans.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    ReservationModule,
    MidtransModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
