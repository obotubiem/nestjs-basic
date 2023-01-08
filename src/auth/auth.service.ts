import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { Prisma, User } from '@prisma/client';
import { refreshTokenConfig } from 'src/config/jwt.config';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { LoginResponse } from './interfaces/login.interface';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginDto;
    const user = await this.userService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }

    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);

    return { accessToken, refreshToken };
  }

  async logout(user: User) {
    this.refreshTokenRepository.updateManyRefreshToken({
      where: {
        user,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
      },
    });

    return { success: true };
  }

  async refreshAccessToken(
    refreshAccessTokenDto: RefreshAccessTokenDto,
  ): Promise<{ accessToken: string }> {
    const { refreshToken } = refreshAccessTokenDto;
    const payload = await this.decodeToken(refreshToken);
    const refreshTokenData = await this.refreshTokenRepository.refreshToken({
      where: { id: payload.jid },
      select: {
        user: {
          select: {
            id: true,
            password: false,
            salt: false,
            createdAt: false,
            updatedAt: false,
          },
        },
      },
    });

    if (!refreshTokenData) {
      throw new UnauthorizedException('Refresh token is not found');
    }

    if (refreshTokenData.isRevoked) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    const accessToken = await this.createAccessToken(refreshTokenData.user);

    return { accessToken };
  }

  async decodeToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh Token is expired');
      } else {
        throw new InternalServerErrorException('Failed to decode token');
      }
    }
  }

  async createAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return accessToken;
  }

  async createRefreshToken(user: User): Promise<string> {
    const expiredAt = new Date();
    expiredAt.setTime(expiredAt.getTime() + +refreshTokenConfig.expiresIn);

    const data: Prisma.RefreshTokenCreateInput = {
      user: { connect: { id: user.id } },
      expiredAt,
    };

    const refreshTokenData =
      await this.refreshTokenRepository.createRefreshToken({
        data,
      });

    const payload = {
      jid: refreshTokenData.id,
    };

    const refreshToken = await this.jwtService.signAsync(
      payload,
      refreshTokenConfig,
    );

    return refreshToken;
  }

  async revokeRefreshToken(id: string) {
    const refreshToken = await this.refreshTokenRepository.refreshToken({
      where: { id },
    });

    if (!refreshToken) {
      throw new NotFoundException('Refresh token is not found');
    }

    await this.refreshTokenRepository.updateRefreshToken({
      where: { id },
      data: {
        isRevoked: true,
      },
    });
  }
}
