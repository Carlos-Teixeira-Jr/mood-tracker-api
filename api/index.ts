import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';

const expressServer = express();

let cachedHandler: any;

async function bootstrap() {
  if (!cachedHandler) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressServer),
    );

    app.enableCors({
      origin: true,
      credentials: true,
    });

    await app.init();

    cachedHandler = expressServer;
  }

  return cachedHandler;
}

export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  return server(req, res);
}
