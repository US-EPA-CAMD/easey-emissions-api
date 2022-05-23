import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { StreamingService } from './../../streaming/streaming.service';
import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { AnnualApportionedEmissionsService } from './annual-apportioned-emissions.service';
import { AnnualApportionedEmissionsController } from './annual-apportioned-emissions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnnualUnitDataRepository]),
  ],
  controllers: [AnnualApportionedEmissionsController],
  providers: [
    ConfigService,
    StreamingService,
    AnnualApportionedEmissionsService
  ],
  exports: [TypeOrmModule],
})
export class AnnualApportionedEmissionsModule {}
