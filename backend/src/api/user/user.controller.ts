import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from '../../dto/login.dto';
import { RegisterDto } from '../../dto/register.dto';
import { ApiResponse } from '@/common/response.interface';
import { successResponse } from '@/common/api.response';
import { AuthGuard } from '@/common/guards/auth.guard';
import { User } from '@/common/decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse | null> {
    const login = await this.userService.login(loginDto);

    return successResponse(login, 'Berhasil Login');
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<ApiResponse | null> {
    const register = await this.userService.register(registerDto);

    return successResponse(register, 'Berhasil Register');
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@User() user: any): Promise<ApiResponse | null> {
    const userProfile = await this.userService.getProfile(user.id);

    return successResponse(userProfile, 'Berhasil Ambil Profile');
  }

  @Post('google')
  async googleLogin(@Body() body: { credential: string }): Promise<ApiResponse | null> {
    const login = await this.userService.loginWithGoogle(body.credential);

    return successResponse(login, 'Berhasil Login Google');
  }
}
