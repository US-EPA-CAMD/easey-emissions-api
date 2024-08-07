import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsController } from './hourly-apportioned-emissions.controller';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([HourUnitDataRepository])],
  controllers: [HourlyApportionedEmissionsController],
  providers: [
    ConfigService,
    HourUnitDataRepository,
    HourlyApportionedEmissionsService,
  ],
  exports: [TypeOrmModule, HourUnitDataRepository],
})
export class HourlyApportionedEmissionsModule {}
