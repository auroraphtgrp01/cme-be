import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerSetup } from '@/common/utils/setup-swagger';
import { ConfigService } from '@nestjs/config';
import { TransformInterceptor } from '@/common/interceptors/transformResponse.interceptor';
import { JwtAuthGuard } from '@/core/auth/guards/jwt-auth.guard';
import { RequestLoggerMiddleWare } from '@/common/middleware/request-logger.middleware';
import { ResolvePromisesInterceptor } from '@/common/interceptors/serializer.interceptor';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { BullMQSetup } from '@/common/utils/bull-mq';

async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter()
  );

  const configService = app.get<ConfigService>(ConfigService);
  const reflector = app.get(Reflector);
  app.setGlobalPrefix('/api');
  BullMQSetup(app);

  app.enableCors({
    origin: [
      'http://localhost:9911',
      'http://localhost:3000',
      'https://tracy.io.vn',
    ],
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Access-Control-Allow-Origin',
      'params',
    ],
    exposedHeaders: ['Set-Cookie'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      transform: true,
    })
  );

  app.useGlobalInterceptors(
    new ResolvePromisesInterceptor(reflector),
    new TransformInterceptor(reflector)
  );
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.use(RequestLoggerMiddleWare);

  app.useWebSocketAdapter(new IoAdapter(app));

  SwaggerSetup(app);

  const PORT = configService.get<number>('BACKEND_PORT', 3000);
  await app.listen(PORT);

  Logger.log(`Server is running on: ${await app.getUrl()}`, 'Bootstrap');

  return app;
}

bootstrap().catch((error) => {
  Logger.error('Failed to bootstrap the application', error, 'Bootstrap');
  process.exit(1);
});

// class CustomIoAdapter extends IoAdapter {
//   createIOServer(port: number, options?: any): any {
//     const server = super.createIOServer(port, {
//       ...options,
//       cors: {
//         origin: ['http://localhost:3000', 'https://uniko.id.vn'],
//         credentials: true,
//         methods: ["GET", "POST", "OPTIONS"],  // Added OPTIONS
//         allowedHeaders: [   // Added allowed headers
//           'Origin',
//           'X-Requested-With',
//           'Content-Type',
//           'Accept',
//           'Authorization',
//         ],
//         transports: ['websocket', 'polling'],
//       },
//     });
//     return server;
//   }
// }
