import { Controller, Patch, Post, UseGuards } from '@nestjs/common';
import {
  Body,
  Param,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/guard/jwt.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { GetUser } from './get-user.decorator';
import { LoginResponse } from './interfaces/login.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  async logout(@GetUser() user: User) {
    return this.authService.logout(user);
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshAccessTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto);
  }

  @Patch(':id/revoke')
  @UseGuards(JwtGuard)
  async revokeRefreshToken(@Param('id') id: string): Promise<void> {
    return this.authService.revokeRefreshToken(id);
  }
}
