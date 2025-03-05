import { LessonModuleController } from '@/modules/lesson-module/lesson-module.controller';
import { LessonModuleService } from '@/modules/lesson-module/lesson-module.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [LessonModuleController],
  providers: [LessonModuleService],
  exports: [LessonModuleService],
})
export class LessonModuleModule { }
