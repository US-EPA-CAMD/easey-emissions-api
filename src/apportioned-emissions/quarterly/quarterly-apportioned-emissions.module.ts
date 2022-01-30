import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { UnitFactMap } from '../../maps/unit-atributes.map';
import { QuarterUnitDataRepository } from './quarter-unit-data.repository';
import { ApportionedEmissionsMap } from '../../maps/apportioned-emissions.map';
import { QuarterlyApportionedEmissionsMap } from '../../maps/quarterly-apportioned-emissions.map';
import { QuarterlyApportionedEmissionsService } from './quarterly-apportioned-emissions.service';
import { QuarterlyApportionedEmissionsController } from './quarterly-apportioned-emissions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuarterUnitDataRepository,
    ]),
    HttpModule,
  ],
  controllers: [
    QuarterlyApportionedEmissionsController
  ],
  providers: [
    UnitFactMap,
    ConfigService,
    ApportionedEmissionsMap,    
    QuarterlyApportionedEmissionsMap,
    QuarterlyApportionedEmissionsService,
  ],
  exports: [
    TypeOrmModule,    
    QuarterlyApportionedEmissionsMap
  ],
})
export class QuarterlyApportionedEmissionsModule {}
