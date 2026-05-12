import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { GoogleService } from './google.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, GoogleService],
})
export class UserModule {}
