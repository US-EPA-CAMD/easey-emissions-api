import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitFactRepository } from '../unit-fact.repository';
import { HourlyMatsApportionedEmissionsModule } from './hourly/hourly-mats-apportioned-emissions.module';
import { MatsApportionedEmissionsController } from './mats-apportioned-emissions.controller';
import { MatsApportionedEmissionsService } from './mats-apportioned-emissions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitFactRepository]),
    HourlyMatsApportionedEmissionsModule,
  ],
  controllers: [MatsApportionedEmissionsController],
  providers: [
    ConfigService,
    MatsApportionedEmissionsService,
    UnitFactRepository,
  ],
  exports: [TypeOrmModule],
})
export class MatsApportionedEmissionsModule {}
