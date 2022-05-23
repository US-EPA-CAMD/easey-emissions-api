import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { StreamingService } from './../../streaming/streaming.service';
import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthlyApportionedEmissionsService } from './monthly-apportioned-emissions.service';
import { MonthlyApportionedEmissionsController } from './monthly-apportioned-emissions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonthUnitDataRepository]),
  ],
  controllers: [MonthlyApportionedEmissionsController],
  providers: [
    ConfigService,
    StreamingService,
    MonthlyApportionedEmissionsService
  ],
  exports: [TypeOrmModule],
})
export class MonthlyApportionedEmissionsModule {}
