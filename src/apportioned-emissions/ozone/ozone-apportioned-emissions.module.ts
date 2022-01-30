import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { UnitFactMap } from '../../maps/unit-atributes.map';
import { OzoneUnitDataRepository } from './ozone-unit-data.repository';
import { ApportionedEmissionsMap } from '../../maps/apportioned-emissions.map';
import { AnnualApportionedEmissionsMap } from '../../maps/annual-apportioned-emissions.map';
import { OzoneApportionedEmissionsMap } from '../../maps/ozone-apportioned-emissions.map';
import { OzoneApportionedEmissionsService } from './ozone-apportioned-emissions.service';
import { OzoneApportionedEmissionsController } from './ozone-apportioned-emissions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OzoneUnitDataRepository,
    ]),
    HttpModule,
  ],
  controllers: [
    OzoneApportionedEmissionsController
  ],
  providers: [
    UnitFactMap,
    ConfigService,
    ApportionedEmissionsMap,
    AnnualApportionedEmissionsMap,
    OzoneApportionedEmissionsMap,
    OzoneApportionedEmissionsService,
  ],
  exports: [
    TypeOrmModule,    
    OzoneApportionedEmissionsMap
  ],
})
export class OzoneApportionedEmissionsModule {}
