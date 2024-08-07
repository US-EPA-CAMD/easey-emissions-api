import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dbConfig } from '@us-epa-camd/easey-common/config';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { CorsOptionsModule } from '@us-epa-camd/easey-common/cors-options';
import { CheckCatalogModule } from '@us-epa-camd/easey-common/check-catalog';
import { ConnectionModule } from '@us-epa-camd/easey-common/connection';
import { DbLookupValidator } from '@us-epa-camd/easey-common/validators';

import routes from './routes';
import appConfig from './config/app.config';
import { TypeOrmConfigService } from './config/typeorm.config';
import { EmissionsModule } from './emissions/emissions.module';
import { ApportionedEmissionsModule } from './apportioned-emissions/apportioned-emissions.module';

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, appConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    CheckCatalogModule.register(
      'camdecmpsmd.vw_emissions_api_check_catalog_results',
    ),
    ConnectionModule,
    LoggerModule,
    CorsOptionsModule,
    EmissionsModule,
    ApportionedEmissionsModule,
  ],
  providers: [DbLookupValidator],
})
export class AppModule {}
