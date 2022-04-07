import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { HourUnitMatsDataRepository } from './hour-unit-mats-data.repository';
import { HourlyMatsApportionedEmissionsService } from './hourly-mats-apportioned-emissions.service';
import { HourlyMatsApportionedEmissionsController } from './hourly-mats-apportioned-emissions.controller';
import { StreamModule } from '@us-epa-camd/easey-common/stream';

@Module({
  imports: [
    TypeOrmModule.forFeature([HourUnitMatsDataRepository]),
    HttpModule,
    StreamModule,
  ],
  controllers: [HourlyMatsApportionedEmissionsController],
  providers: [ConfigService, HourlyMatsApportionedEmissionsService],
  exports: [TypeOrmModule],
})
export class HourlyMatsApportionedEmissionsModule {}
