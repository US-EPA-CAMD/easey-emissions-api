import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthlyApportionedEmissionsController } from './monthly-apportioned-emissions.controller';
import { MonthlyApportionedEmissionsService } from './monthly-apportioned-emissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonthUnitDataRepository])],
  controllers: [MonthlyApportionedEmissionsController],
  providers: [
    ConfigService,
    MonthlyApportionedEmissionsService,
    MonthUnitDataRepository,
  ],
  exports: [TypeOrmModule],
})
export class MonthlyApportionedEmissionsModule {}
