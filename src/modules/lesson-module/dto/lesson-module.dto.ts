import { EUserRoles } from '@/core/auth/dto/create-auth.dto';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsBooleanString,
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

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

export class ValidateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class VerifyEmailDto {
  @IsString()
  token: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  profession?: string;

  @IsString()
  @IsOptional()
  avatarId?: string;

  @IsString()
  @IsOptional()
  full_name?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateOfBirth?: Date;

  @IsString()
  @IsOptional()
  placeOfBirth?: string;

  @IsString()
  @IsOptional()
  specialization?: string;

  @IsString()
  @IsOptional()
  placeOfGraduation?: string;

  @IsString()
  @IsOptional()
  highestDegree?: string;

  @IsString()
  @IsOptional()
  yearOfGraduation?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  license_number?: string;

  @IsString()
  @IsOptional()
  experience?: string;

  @IsString()
  @IsOptional()
  workplace?: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  refresh_token?: string;

  @IsString()
  @IsOptional()
  forgetPasswordToken?: string;
}

export class UpdatePasswordDto {
  @IsString()
  @IsOptional()
  currentPassword: string;

  @IsString()
  newPassword: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}
