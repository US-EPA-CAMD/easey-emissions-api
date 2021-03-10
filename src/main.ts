import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const appTitle = configService.get<string>('app.title');
  const appPath = configService.get<string>('app.path');
  const appEnv = configService.get<string>('app.env');
  const appVersion = configService.get<string>('app.version');
  const appPublished = configService.get<string>('app.published');

  let appDesc = null;
  let swaggerCustomOptions = null;

  if (appEnv != 'production') {
    appDesc = `EPA ${appEnv} Environment: The content on this page is not production data and used for <strong>development</strong> and/or <strong>testing</strong> purposes only.`
    swaggerCustomOptions = {
      customCss: '.description .renderedMarkdown p { color: #FC0; padding: 10px; background: linear-gradient(to bottom,#520001 0%,#6c0810 100%); }'
    };
  }

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix(appPath);
  app.enableCors();  

  const swaggerDocOptions = new DocumentBuilder()
    .setTitle(`${appTitle} OpenAPI Specification`)
    .setDescription(appDesc)
    .setVersion(`${appVersion} published: ${appPublished}`)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerDocOptions);
  SwaggerModule.setup(`${appPath}/swagger`, app, document, swaggerCustomOptions);

  await app.listen(configService.get<number>('app.port'));
  console.log(`Application is running on: ${await app.getUrl()}/${appPath}/swagger`);
}

bootstrap();
