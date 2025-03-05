import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from '@/core/core.module';
import { UserModule } from '@/modules/users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionsFilter } from '@/core/errors/global-exception.filter';
import { CategoryModule } from '@/modules/category/category.module';
import { LessonModule } from '@/modules/lesson/lesson.module';
import { CourseProgressModule } from '@/modules/course-progress/course-progress.module';
import { CourseModule } from '@/modules/course/course.module';
import { PaymentModule } from '@/modules/payment/payment.module';
import { SeminarModule } from '@/modules/seminar/seminar.module';
import { QuizModule } from '@/modules/quiz/quiz.module';
import { QuestionModule } from '@/modules/question/question.module';
import { LessonModuleModule } from '@/modules/lesson-module/lesson-module.module';
import { RegistrationModule } from '@/modules/registration/registration.module';
import { FileModule } from '@/modules/file/file.module';
import { MediaModule } from '@/modules/media/media.module';
// Zone Import

const importVar = [
  CoreModule,
  UserModule,
  CategoryModule,
  LessonModule,
  CourseProgressModule,
  CourseModule,
  PaymentModule,
  QuizModule,
  QuestionModule,
  SeminarModule,
  LessonModuleModule,
  RegistrationModule,
  FileModule,
  MediaModule
];

const providers = [
  {
    provide: APP_FILTER,
    useClass: GlobalExceptionsFilter,
  },
];

@Module({
  imports: [...importVar],
  controllers: [AppController],
  providers: [AppService, ...providers],
})
export class AppModule { }
