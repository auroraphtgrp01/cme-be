import type { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export function SwaggerSetup(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('This is a NestJS Application')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'token',
        description: 'Enter JWT token',
        in: 'header'
      },
      'token'
    )

  const document = SwaggerModule.createDocument(app, documentBuilder.build(), {
    deepScanRoutes: true
  })

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      explore: true,
      deepLinking: true,
      persistAuthorization: true
    }
  })
}
