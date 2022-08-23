import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dbConfig } from '@us-epa-camd/easey-common/config';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { CorsOptionsModule } from '@us-epa-camd/easey-common/cors-options';

import routes from './routes';
import appConfig from './config/app.config';
import { TypeOrmConfigService } from './config/typeorm.config';
import { EmissionsModule } from './emissions/emissions.module';
import { EmissionsWorkspaceModule } from './emissions-workspace/emissions.module';
import { ApportionedEmissionsModule } from './apportioned-emissions/apportioned-emissions.module';
import { MatsDerivedHrlyValueModule } from './mats-derived-hrly-value-workspace/mats-derived-hrly-value.module';
import { PlantModule } from './plant/plant.module';

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
    LoggerModule,
    CorsOptionsModule,
    EmissionsModule,
    EmissionsWorkspaceModule,
    ApportionedEmissionsModule,
    PlantModule,
    MatsDerivedHrlyValueModule,
  ],
})
export class AppModule {}
