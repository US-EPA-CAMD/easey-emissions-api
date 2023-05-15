import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { MatsApportionedEmissionsService } from './mats-apportioned-emissions.service';
import { MatsApportionedEmissionsController } from './mats-apportioned-emissions.controller';
import { HourlyMatsApportionedEmissionsModule } from './hourly/hourly-mats-apportioned-emissions.module';
import { UnitFactRepository } from '../unit-fact.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitFactRepository]),
    HourlyMatsApportionedEmissionsModule,
  ],
  controllers: [MatsApportionedEmissionsController],
  providers: [ConfigService, MatsApportionedEmissionsService],
  exports: [TypeOrmModule],
})
export class MatsApportionedEmissionsModule {}
