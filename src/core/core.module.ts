import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ErrorService } from '@/core/errors/error.service';
import { AuthModule } from '@/core/auth/auth.module';
import authConfig from '@/core/auth/config/auth.config';
import appConfig from '@/common/config/app.config';
import redisConfig from '@/common/config/redis.config';
import { BullModule } from '@nestjs/bullmq';
import { QueueRedisModule } from '@/core/queues/queue-redis.module';
@Global()
@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, redisConfig],
      envFilePath: ['.env'],
    }),
    QueueRedisModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        await {
          connection: {
            host: configService.get<string>('redis.host', 'localhost'),
            port: configService.get<number>('redis.port', 6379),
            password: configService.get<string>(
              'redis.password',
              'your_password_here'
            ),
          },
        },
    }),
  ],
  providers: [ErrorService],
  exports: [DatabaseModule, AuthModule, ErrorService, QueueRedisModule],
})
export class CoreModule {}
