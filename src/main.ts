import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isDev = process.env.ENVIRONMENT === 'dev';

  if (isDev) {
    app.enableCors({
      origin: true,
      credentials: true,
    });
  } else {
    app.enableCors({
      origin: process.env.PROD_CLIENT_URL,
      credentials: true,
    });
  }

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

bootstrap();
