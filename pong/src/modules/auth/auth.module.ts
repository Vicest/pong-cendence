import { Module } from '@nestjs/common';
import  AuthController  from './auth.controller'

@Module({
  controllers: [],
  providers: [AuthController],
  exports: [AuthController],
})
export class AuthModule {}
