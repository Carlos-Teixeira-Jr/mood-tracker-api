import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { json, urlencoded } from 'express';
import { AppModule } from '../src/app.module';

const expressServer = express();

expressServer.use(json());
expressServer.use(urlencoded({ extended: true }));

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressServer),
      {
        bodyParser: false,
      },
    );

    app.enableCors({
      origin: true,
      credentials: true,
    });

    await app.init();

    cachedServer = expressServer;
  }

  return cachedServer;
}

export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  return server(req, res);
}
