import { UserInfo } from '@/common/decorators/users.decorator';
import { ChangePasswordDto } from '@/core/auth/dto/create-auth.dto';
import { RegistrationService } from '@/modules/registration/registration.service';
import { SeminarService } from '@/modules/seminar/seminar.service';
import { RegisterUserDto, UpdateUserDto, ValidateUserDto } from '@/modules/users/dto/user.dto';
import { IUserFromToken } from '@/modules/users/user.i';
import { UserService } from '@/modules/users/users.service';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';

@Controller('registration')
export class SeminarController {
  constructor(private readonly seminarService: SeminarService) { }
}
