import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import routes from './routes';
import dbConfig from './config/db.config';
import appConfig from './config/app.config';
import corsConfig from './config/cors.config';
import { TypeOrmConfigService } from './config/typeorm.config';

import { ApportionedEmissionsModule } from './apportioned-emissions/apportioned-emissions.module';

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        dbConfig,
        appConfig,
        corsConfig,
      ],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    ApportionedEmissionsModule,
  ],
})
export class AppModule {}
