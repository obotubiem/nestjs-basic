import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exception.filter';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { ValidationError } from 'class-validator';
import { ValidationPipeException } from './validation-pipe.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapterHost = app.get(HttpAdapterHost);

  const config = new DocumentBuilder()
    .setTitle('Book API')
    .setDescription('Book API')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) =>
        new ValidationPipeException(validationErrors),
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  await app.listen(3000);
}
bootstrap();
