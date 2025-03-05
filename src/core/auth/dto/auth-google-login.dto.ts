import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class AuthGoogleLoginDto {
  @IsString()
  @IsOptional()
  access_token?: string

  @IsString()
  @IsOptional()
  credential?: string
}
