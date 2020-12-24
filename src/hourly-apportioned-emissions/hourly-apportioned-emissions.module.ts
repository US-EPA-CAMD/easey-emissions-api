import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HourlyApportionedEmissionsController } from './hourly-apportioned-emissions.controller';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsMap } from 'src/maps/hourly-apportioned-emissions.map';
import { StateCodeRepository } from './state-code.repository';

@Module({
  imports: [TypeOrmModule.forFeature([HourUnitDataRepository, StateCodeRepository]),],
  controllers: [HourlyApportionedEmissionsController],
  providers: [HourlyApportionedEmissionsMap, HourlyApportionedEmissionsService],
})
export class HourlyApportionedEmissionsModule {}
