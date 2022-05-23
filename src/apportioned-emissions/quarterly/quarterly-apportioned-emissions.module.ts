import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { StreamingService } from './../../streaming/streaming.service';
import { QuarterUnitDataRepository } from './quarter-unit-data.repository';
import { QuarterlyApportionedEmissionsService } from './quarterly-apportioned-emissions.service';
import { QuarterlyApportionedEmissionsController } from './quarterly-apportioned-emissions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuarterUnitDataRepository]),
  ],
  controllers: [QuarterlyApportionedEmissionsController],
  providers: [
    ConfigService,
    StreamingService,
    QuarterlyApportionedEmissionsService
  ],
  exports: [TypeOrmModule],
})
export class QuarterlyApportionedEmissionsModule {}
