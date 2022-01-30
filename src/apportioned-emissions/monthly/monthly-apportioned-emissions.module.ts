import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { UnitFactMap } from '../../maps/unit-atributes.map';
import { MonthUnitDataRepository } from './month-unit-data.repository';
import { ApportionedEmissionsMap } from '../../maps/apportioned-emissions.map';
import { MonthlyApportionedEmissionsMap } from '../../maps/monthly-apportioned-emissions.map';
import { MonthlyApportionedEmissionsService } from './monthly-apportioned-emissions.service';
import { MonthlyApportionedEmissionsController } from './monthly-apportioned-emissions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MonthUnitDataRepository,
    ]),
    HttpModule,
  ],
  controllers: [
    MonthlyApportionedEmissionsController
  ],
  providers: [
    UnitFactMap,
    ConfigService,
    ApportionedEmissionsMap,    
    MonthlyApportionedEmissionsMap,
    MonthlyApportionedEmissionsService,
  ],
  exports: [
    TypeOrmModule,    
    MonthlyApportionedEmissionsMap
  ],
})
export class MonthlyApportionedEmissionsModule {}
