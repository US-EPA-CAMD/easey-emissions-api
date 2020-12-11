import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const appTitle = configService.get<string>('app.title');
  const appPath = configService.get<string>('app.path');

  app.setGlobalPrefix(appPath);
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle(`${appTitle} API`)
    .setDescription(`${appTitle} OpenAPI specification`)
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${appPath}/swagger`, app, document);

  await app.listen(configService.get<number>('app.port'));
  console.log(`Application is running on: ${await app.getUrl()}/${appPath}`);
}

bootstrap();
