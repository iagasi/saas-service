import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupDatabase } from './utils/database.utils';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PORT } from './constants';
import { AuthGuard } from './utils/jwt/auth.guard';

async function bootstrap() {
  setupDatabase();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuard(reflector));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  app.enableCors();
  await app.listen(PORT);
}
bootstrap();
