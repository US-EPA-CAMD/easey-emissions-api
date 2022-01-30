import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { UnitFactMap } from '../../maps/unit-atributes.map';
import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { ApportionedEmissionsMap } from '../../maps/apportioned-emissions.map';
import { AnnualApportionedEmissionsMap } from '../../maps/annual-apportioned-emissions.map';
import { AnnualApportionedEmissionsService } from './annual-apportioned-emissions.service';
import { AnnualApportionedEmissionsController } from './annual-apportioned-emissions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AnnualUnitDataRepository,
    ]),
    HttpModule,
  ],
  controllers: [
    AnnualApportionedEmissionsController
  ],
  providers: [
    UnitFactMap,
    ConfigService,
    ApportionedEmissionsMap,    
    AnnualApportionedEmissionsMap,
    AnnualApportionedEmissionsService,
  ],
  exports: [
    TypeOrmModule,    
    AnnualApportionedEmissionsMap
  ],
})
export class AnnualApportionedEmissionsModule {}
