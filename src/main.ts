import { Request } from 'express';
import { getManager } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CorsOptionsCallback } from '@nestjs/common/interfaces/external/cors-options.interface';

import { AppModule } from './app.module';

const configureCorsOptions = async (req: Request, appName: string, callback: CorsOptionsCallback) => {
  let corsOptions;
  const originHeader = req.header('Origin');

  if (originHeader !== null && originHeader !== undefined) {
    const manager = getManager();
    const corsResults = await manager.query(`
      SELECT key, value
      FROM camdaux.cors
      LEFT JOIN camdaux.cors_to_api
        USING(cors_id)
      LEFT JOIN camdaux.api
        USING(api_id)
      WHERE api_id IS NULL OR name = '${appName}'
      ORDER BY key, value;
    `);

    const allowedOrigins = corsResults.filter(i => i.key === 'origin');
    const allowedHeaders = corsResults.filter(i => i.key === 'header');
    const allowedMethods = corsResults.filter(i => i.key === 'method');

    if (originHeader.match(/https?:\/\/(localhost|127\.0\.0\.1|\[::1\]):\d+/)) {
      allowedOrigins.push({
        key: "origin",
        value: originHeader
      });
    }

    corsOptions = {
      origin: allowedOrigins.map(i => i.value).includes(originHeader) ? originHeader : false,
      exposedHeaders: allowedHeaders.length > 0 ? allowedHeaders.map(i => i.value) : [],
      methods: allowedMethods.length > 0 ? allowedMethods.map(i => i.value) : [],
    };
  }
  else {
    corsOptions = {
      origin: false,
      exposedHeaders: [],
      methods: [],
    };
  }

  callback(null, corsOptions);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const appName = configService.get<string>('app.name');
  const appTitle = configService.get<string>('app.title');
  const appPath = configService.get<string>('app.path');
  const appEnv = configService.get<string>('app.env');
  const appVersion = configService.get<string>('app.version');
  const appPublished = configService.get<string>('app.published');

  let appDesc = null;
  let swaggerCustomOptions = null;

  if (appEnv !== 'production') {
    appDesc = `EPA ${appEnv} Environment: The content on this page is not production data and used for <strong>development</strong> and/or <strong>testing</strong> purposes only.`;
    swaggerCustomOptions = {
      customCss:
        '.description .renderedMarkdown p { color: #FC0; padding: 10px; background: linear-gradient(to bottom,#520001 0%,#6c0810 100%); }',
    };
  }

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix(appPath);

  app.enableCors(async (req, callback) => {
    await configureCorsOptions(req, appName, callback);
  });

  const swaggerDocOptions = new DocumentBuilder()
    .setTitle(`${appTitle} OpenAPI Specification`)
    .setDescription(appDesc)
    .setVersion(`${appVersion} published: ${appPublished}`)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerDocOptions);
  SwaggerModule.setup(
    `${appPath}/swagger`,
    app,
    document,
    swaggerCustomOptions,
  );

  await app.listen(configService.get<number>('app.port'));
  console.log(
    `Application is running on: ${await app.getUrl()}/${appPath}/swagger`,
  );
}

bootstrap();
