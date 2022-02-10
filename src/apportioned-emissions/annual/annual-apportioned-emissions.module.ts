import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { AnnualApportionedEmissionsService } from './annual-apportioned-emissions.service';
import { AnnualApportionedEmissionsController } from './annual-apportioned-emissions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AnnualUnitDataRepository]), HttpModule],
  controllers: [AnnualApportionedEmissionsController],
  providers: [ConfigService, AnnualApportionedEmissionsService],
  exports: [TypeOrmModule],
})
export class AnnualApportionedEmissionsModule {}
