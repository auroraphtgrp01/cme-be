export type AuthConfig = {
  accessTokenSecret?: string;
  accessTokenExpiresIn?: string;
  refreshTokenSecret?: string;
  refreshTokenExpiresIn?: string;
  forgotPasswordSecret?: string;
  acceptedSecret?: string;
  acceptedExpiresIn?: string;
  confirmEmailSecret?: string;
  forgotPasswordExpiresIn?: string;
  confirmEmailExpiresIn?: string;
  migratePathPermission?: string;
};
