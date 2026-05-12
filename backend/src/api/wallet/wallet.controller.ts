import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from '@/common/guards/auth.guard';
import { User } from '@/common/decorators/user.decorator';
import { successResponse } from '@/common/api.response';
import { ApiResponse } from '@/common/response.interface';

@Controller('wallet')
@UseGuards(AuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('history')
  async getHistory(
    @User('id') userId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<ApiResponse> {
    const history = await this.walletService.getHistory(
      userId,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
    return successResponse(history, 'Berhasil mendapatkan riwayat mutasi saldo');
  }
}
