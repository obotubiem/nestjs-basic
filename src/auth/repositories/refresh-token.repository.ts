import { Injectable } from '@nestjs/common';
import { Prisma, RefreshToken } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

export const refreshTokenSelectSchema = {
  id: true,
  userId: true,
  isRevoked: true,
  expiredAt: true,
};

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createRefreshToken(params: Prisma.RefreshTokenCreateArgs) {
    const { data, select } = params;
    return await this.prisma.refreshToken.create({
      data,
      select: { ...refreshTokenSelectSchema, ...select },
    });
  }

  async refreshToken(params: Prisma.RefreshTokenFindUniqueArgs) {
    const { where, select } = params;

    return this.prisma.refreshToken.findUnique({
      where,
      select: { ...refreshTokenSelectSchema, ...select },
    });
  }

  async updateRefreshToken(params: Prisma.RefreshTokenUpdateArgs) {
    const { where, data, select } = params;
    return this.prisma.refreshToken.update({
      data,
      where,
      select: { ...refreshTokenSelectSchema, ...select },
    });
  }

  async updateManyRefreshToken(params: Prisma.RefreshTokenUpdateManyArgs) {
    const { where, data } = params;
    return this.prisma.refreshToken.updateMany({
      data,
      where,
    });
  }

  async deleteRefreshToken(params: Prisma.RefreshTokenDeleteArgs) {
    const { where, select } = params;

    return this.prisma.refreshToken.delete({
      where,
      select: { ...refreshTokenSelectSchema, ...select },
    });
  }
}
