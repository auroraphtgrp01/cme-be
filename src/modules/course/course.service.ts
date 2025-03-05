import { DatabaseService } from '@/core/database/database.service';
import { comparePassword, hashPassword } from '@/common/utils/hashPassword';

import {
  Injectable,
  Logger,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import { RegisterUserDto, UpdateUserDto, ValidateUserDto } from '@/modules/users/dto/user.dto';
import { IUserFromToken } from '@/modules/users/user.i';
import {
  EUserRoles,
  RegisterUserNormal,
} from '@/core/auth/dto/create-auth.dto';
@Injectable()
export class CourseService {
  constructor(private readonly databaseService: DatabaseService) { }
  private readonly logger = new Logger(CourseService.name);

}
