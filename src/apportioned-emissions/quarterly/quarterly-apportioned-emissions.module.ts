import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuarterUnitDataRepository } from './quarter-unit-data.repository';
import { QuarterlyApportionedEmissionsController } from './quarterly-apportioned-emissions.controller';
import { QuarterlyApportionedEmissionsService } from './quarterly-apportioned-emissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuarterUnitDataRepository])],
  controllers: [QuarterlyApportionedEmissionsController],
  providers: [
    ConfigService,
    QuarterlyApportionedEmissionsService,
    QuarterUnitDataRepository,
  ],
  exports: [TypeOrmModule, QuarterUnitDataRepository],
})
export class QuarterlyApportionedEmissionsModule {}
