import { UserInfo } from '@/common/decorators/users.decorator';
import { ChangePasswordDto } from '@/core/auth/dto/create-auth.dto';
import { CourseProgressService } from '@/modules/course-progress/course-progress.service';
import { RegisterUserDto, UpdateUserDto, ValidateUserDto } from '@/modules/users/dto/user.dto';
import { IUserFromToken } from '@/modules/users/user.i';
import { UserService } from '@/modules/users/users.service';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';

@Controller('course-progress')
export class CourseProgressController {
  constructor(private readonly courseProgressService: CourseProgressService) { }

}
