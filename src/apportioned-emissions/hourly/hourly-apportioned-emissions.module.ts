import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';
import { HourlyApportionedEmissionsController } from './hourly-apportioned-emissions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HourUnitDataRepository]), HttpModule],
  controllers: [HourlyApportionedEmissionsController],
  providers: [ConfigService, HourlyApportionedEmissionsService],
  exports: [TypeOrmModule],
})
export class HourlyApportionedEmissionsModule {}
