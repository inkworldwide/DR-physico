import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('PhysioEdvanceBootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  // Configure Swagger OpenAPI 3.0 Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('PhysioEdvance REST API & Biometrics Engine')
    .setDescription(
      'Official Backend API for PhysioEdvance EdTech Platform - Supporting 2-Step Biometric Face Verification, Academic Subjects, Digital LMS, Research Desk, Blog CMS, Appointments, Razorpay Payments, and Zoom Scheduling.'
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 PhysioEdvance Backend API running at: http://localhost:${port}/api/v1`);
  logger.log(`📚 Swagger API Documentation available at: http://localhost:${port}/api/docs`);
}

bootstrap();
