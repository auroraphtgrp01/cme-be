import validateConfig from '@/common/utils/validateConfig.utils';
import { registerAs } from '@nestjs/config';

import { IsBooleanString, IsString } from 'class-validator';
import { AuthConfig } from './auth-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  JWT_ACCESS_TOKEN_SECRET_KEY: string;

  @IsString()
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: string;

  @IsString()
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: string;

  @IsString()
  JWT_REFRESH_TOKEN_SECRET_KEY: string;

  @IsString()
  JWT_FORGOT_PASSWORD_TOKEN_SECRET_KEY: string;

  @IsString()
  JWT_FORGOT_PASSWORD_TOKEN_EXPIRATION_TIME: string;

  @IsString()
  JWT_VERIFY_EMAIL_TOKEN_SECRET_KEY: string;

  @IsString()
  JWT_VERIFY_EMAIL_TOKEN_EXPIRATION_TIME: string;
}

export default registerAs<AuthConfig>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    forgotPasswordSecret: process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET_KEY,
    forgotPasswordExpiresIn:
      process.env.JWT_FORGOT_PASSWORD_TOKEN_EXPIRATION_TIME,
    acceptedSecret: process.env.JWT_ACCEPTED_TOKEN_SECRET_KEY,
    acceptedExpiresIn: process.env.JWT_ACCEPTED_TOKEN_EXPIRATION_TIME,
    confirmEmailSecret: process.env.JWT_VERIFY_EMAIL_TOKEN_SECRET_KEY,
    confirmEmailExpiresIn: process.env.JWT_VERIFY_EMAIL_TOKEN_EXPIRATION_TIME,
    clientIdGoogle: process.env.GOOGLE_CLIENT_ID,
    clientSecretGoogle: process.env.GOOGLE_SECRET,
  };
});
