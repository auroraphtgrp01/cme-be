import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  IsDateString,
  MaxLength,
  MinLength,
  IsEnum,
  IsBoolean
} from 'class-validator'

export enum EUserRoles {
  ADMIN = 'ADMIN',
  USER = 'USER',
  EXPERT = 'EXPERT'
}
export class RegisterUserDto {
  @IsBoolean()
  @IsOptional()
  isRegisteredWithGoogle: boolean

  @IsString()
  @IsOptional()
  profession?: string

  @IsString()
  @IsNotEmpty()
  full_name?: string

  @IsDateString()
  @IsNotEmpty()
  date_of_birth?: string

  @IsString()
  @IsNotEmpty()
  gender?: string

  @IsString()
  @IsOptional()
  license_number?: string

  @IsString()
  @IsOptional()
  specialization?: string

  @IsString()
  @IsOptional()
  picture?: string

  @IsString()
  @IsOptional()
  experience?: string

  @IsString()
  @IsOptional()
  workplace?: string

  @MaxLength(10)
  @MinLength(10)
  @IsNotEmpty()
  phone_number?: string

  @IsString()
  @IsOptional()
  address?: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsEnum(EUserRoles)
  @IsOptional()
  roles?: string

  @IsString()
  password: string

  @IsOptional()
  @IsString()
  typeLogin?: string
}
export class RegisterUserWithGoogleDto{
  @IsBoolean()
  @IsOptional()
  isRegisteredWithGoogle: boolean


  @IsString()
  @IsNotEmpty()
  full_name?: string

  @IsString()
  @IsOptional()
  picture?: string


  @IsEmail()
  @IsNotEmpty()
  email: string


  @IsEnum(EUserRoles)
  @IsOptional()
  roles?: string
}
export class RegisterUserNormal {
  @IsString()
  @IsNotEmpty()
  full_name?: string

  @IsString()
  password: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @MaxLength(10)
  @MinLength(10)
  @IsNotEmpty()
  phone_number?: string
}
export class TokenVerificationDto {
  @IsString()
  @IsNotEmpty()
  token: string
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string

  @IsString()
  @IsNotEmpty()
  newPassword: string
}
