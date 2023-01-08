import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { jwtConfig } from 'src/config/jwt.config';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { PrismaModule } from 'src/database/prisma.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [JwtModule.register(jwtConfig), PrismaModule, UserModule],
  providers: [AuthService, RefreshTokenRepository, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
