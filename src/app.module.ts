import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from '@/core/core.module';
import { UserModule } from '@/modules/users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionsFilter } from '@/core/errors/global-exception.filter';
// Zone Import

const importVar = [
  CoreModule,
  UserModule,
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
export class AppModule {}
