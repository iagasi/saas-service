import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupDatabase } from './utils/database.utils';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PORT } from './constants';
import { AuthGuard } from './utils/jwt/auth.guard';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  setupDatabase();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuard(reflector));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.setViewEngine('hbs');

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Example')
    .setDescription('The  API description')
    .setVersion('1.0')
    .addTag('Saas')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  await app.listen(PORT);
}
bootstrap();
