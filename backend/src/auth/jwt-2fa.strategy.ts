import { Controller, UseGuards, Get, Res, Req, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
  constructor(private readonly AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret',
    });
  }

  async validate(@Req() req) {

    if (!req.user.two_factor_auth_enabled) {
      return req.user;
    }
    if (this.AuthService.check2FAToken(req.user, )) {
      return req.user;
    }
  }
}