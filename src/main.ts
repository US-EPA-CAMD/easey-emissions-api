import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  applySwagger,
  applyMiddleware,
} from '@us-epa-camd/easey-common/nestjs';
import { useContainer } from 'class-validator';
import * as http from 'http';

import { AppModule } from './app.module';

let server: http.Server;

async function gracefulShutdown(exitCode: number) {
  console.error('Initiating graceful shutdown...');

  if (server) {
    await new Promise<void>((resolve) => {
      server.close(() => {
        console.log('HTTP server closed');
        resolve();
      });
    });
  }

  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(exitCode);
  }, 10000).unref();

  process.exit(exitCode);
}

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await applyMiddleware(AppModule, app, true);
  await applySwagger(app);

  const configService = app.get(ConfigService);
  const appPath = configService.get<string>('app.path');
  const appPort = configService.get<number>('app.port');
  const enableDebug = configService.get<boolean>('app.enableDebug');

  server = await app.listen(appPort);
  server.setTimeout(1800000);

  if (enableDebug) {
    console.log('config: ', configService.get('app'));
    console.log(
      `Application is running on: ${await app.getUrl()}/${appPath}/swagger`,
    );
  }
}

bootstrap();

process.on('unhandledRejection', (reason, promise) => {
  console.error('unhandledRejection: Unhandled Promise Rejection');
  console.error('Promise:', promise);
  console.error('Reason:', reason);
  console.error('Stack:', reason instanceof Error ? reason.stack : 'N/A');
  gracefulShutdown(1);
});

process.on('uncaughtException', (error) => {
  console.error('uncaughtException: Uncaught Exception');
  console.error('Error:', error);
  console.error('Stack:', error.stack);
  gracefulShutdown(1);
});
