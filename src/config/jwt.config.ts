import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: 'secretcode',
  signOptions: {
    expiresIn: 60,
  },
};

export const refreshTokenConfig: JwtSignOptions = {
  expiresIn: 24 * 60 * 60 * 1000,
};
