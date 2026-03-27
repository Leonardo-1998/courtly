import { Controller, Get, Post, Put, Delete, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from '../../dto/login.dto';
import { RegisterDto } from '../../dto/register.dto';
import { ApiResponse } from '@/common/response.interface';
import { successResponse } from '@/common/api.response';

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
}
