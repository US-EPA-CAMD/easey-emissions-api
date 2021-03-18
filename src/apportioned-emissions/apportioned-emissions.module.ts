import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApportionedEmissionsController } from './apportioned-emissions.controller';
import { ApportionedEmissionsService } from './apportioned-emissions.service';
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsMap } from '../maps/hourly-apportioned-emissions.map';

@Module({
  imports: [TypeOrmModule.forFeature([HourUnitDataRepository])],
  controllers: [ApportionedEmissionsController],
  providers: [HourlyApportionedEmissionsMap, ApportionedEmissionsService],
})
export class ApportionedEmissionsModule {}
