import { CourseProgressController } from '@/modules/course-progress/course-progress.controller';
import { CourseProgressService } from '@/modules/course-progress/course-progress.service';
import { UserController } from '@/modules/users/users.controller';
import { UserService } from '@/modules/users/users.service';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  controllers: [CourseProgressController],
  providers: [CourseProgressService],
  exports: [CourseProgressService],
})
export class CourseProgressModule { }
