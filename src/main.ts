import { getManager } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const appName = 'emission-api';
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
    let corsOptions;
    const hostHeader = req.header('Host');
    const originHeader = req.header('Origin').replace('https://easey-dev.', '');
    const refererHeader = req.header('Referer');

    if (
        refererHeader === null || 
        refererHeader === undefined || 
        refererHeader.includes('localhost') || 
        refererHeader.includes('127.0.0.1') || 
        refererHeader.includes('[::1]')
      ) {
      corsOptions = {
        origin: '*',
        exposedHeaders: '*',
        methods: '*',
      };      
    } else {
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

      corsOptions = {
        origin: allowedOrigins.map(i => i.value).includes(originHeader) ? originHeader : null,
        exposedHeaders: allowedHeaders.length > 0 ? allowedHeaders.map(i => i.value) : null,
        methods: allowedMethods.length > 0 ? allowedMethods.map(i => i.value) : null,
      };
    }

    console.log(`hostHeader: ${hostHeader}`);
    console.log(`originHeader: ${originHeader}`);
    console.log(`refererHeader: ${refererHeader}`);
    console.log(corsOptions);

    callback(null, corsOptions)
  });

  const swaggerDocOptions = new DocumentBuilder()
    .setTitle(`${appTitle} OpenAPI Specification`)
    .setDescription(appDesc)
    .setVersion(`${appVersion} published: ${appPublished}`)
    //.addServer('http://[::1]:8080')
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
