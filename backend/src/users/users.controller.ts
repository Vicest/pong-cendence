import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService:UsersService) {}

  @UseGuards(JwtGuard)
  @Get('/all')
  getAll() {
    let users = this.usersService.findAll();
    return users;
  }
}