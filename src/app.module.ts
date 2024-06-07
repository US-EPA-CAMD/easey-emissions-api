import { HttpModule } from '@nestjs/axios';
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
import { EmissionsWorkspaceModule } from './emissions-workspace/emissions.module';
import { ApportionedEmissionsModule } from './apportioned-emissions/apportioned-emissions.module';
import { PlantModule } from './plant/plant.module';
import { DerivedHourlyValueModule } from './derived-hourly-value/derived-hourly-value.module';
import { DerivedHourlyValueWorkspaceModule } from './derived-hourly-value-workspace/derived-hourly-value-workspace.module';
import { HourlyParameterFuelFlowWorkspaceModule } from './hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.module';
import { HourlyFuelFlowModule } from './hourly-fuel-flow/hourly-fuel-flow.module';
import { DailyEmissionWorkspaceModule } from './daily-emission-workspace/daily-emission-workspace.module';
import { DailyEmissionModule } from './daily-emission/daily-emission.module';
import { DailyFuelModule } from './daily-fuel/daily-fuel.module';
import { DailyFuelWorkspaceModule } from './daily-fuel-workspace/daily-fuel-workspace.module';
import { SorbentTrapModule } from './sorbent-trap/sorbent-trap.module';
import { SamplingTrainModule } from './sampling-train/sampling-train.module';
import { SorbentTrapWorkspaceModule } from './sorbent-trap-workspace/sorbent-trap-workspace.module';
import { SamplingTrainWorkspaceModule } from './sampling-train-workspace/sampling-train-workspace.module';
import { MonitorFormulaModule } from './monitor-formula/monitor-formula.module';
import { MonitorSystemModule } from './monitor-system/monitor-system.module';
import { Nsps4tAnnualWorkspaceModule } from './nsps4t-annual-workspace/nsps4t-annual-workspace.module';
import { Nsps4tCompliancePeriodWorkspaceModule } from './nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.module';
import { Nsps4tSummaryWorkspaceModule } from './nsps4t-summary-workspace/nsps4t-summary-workspace.module';
import { Nsps4tSummaryModule } from './nsps4t-summary/nsps4t-summary.module';
import { Nsps4tCompliancePeriodModule } from './nsps4t-compliance-period/nsps4t-compliance-period.module';
import { Nsps4tAnnualModule } from './nsps4t-annual/nsps4t-annual.module';
import { WhatHasDataModule } from './what-has-data/what-has-data.module';

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
    EmissionsWorkspaceModule,
    ApportionedEmissionsModule,
    PlantModule,
    DerivedHourlyValueModule,
    DerivedHourlyValueWorkspaceModule,
    HourlyParameterFuelFlowWorkspaceModule,
    HourlyFuelFlowModule,
    DailyEmissionModule,
    DailyEmissionWorkspaceModule,
    DailyFuelModule,
    DailyFuelWorkspaceModule,
    SorbentTrapModule,
    SamplingTrainModule,
    SorbentTrapWorkspaceModule,
    SamplingTrainWorkspaceModule,
    MonitorFormulaModule,
    MonitorSystemModule,
    Nsps4tAnnualWorkspaceModule,
    Nsps4tCompliancePeriodWorkspaceModule,
    Nsps4tSummaryWorkspaceModule,
    Nsps4tSummaryModule,
    Nsps4tCompliancePeriodModule,
    Nsps4tAnnualModule,
    WhatHasDataModule,
    HttpModule,
  ],
  providers: [DbLookupValidator],
})
export class AppModule {}
