import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HourlyApportionedEmissionsModule } from './hourly/hourly-apportioned-emissions.module';
import { DailyApportionedEmissionsModule } from './daily/daily-apportioned-emissions.module';
import { MonthlyApportionedEmissionsModule } from './monthly/monthly-apportioned-emissions.module';
import { QuarterlyApportionedEmissionsModule } from './quarterly/quarterly-apportioned-emissions.module';
import { AnnualApportionedEmissionsModule } from './annual/annual-apportioned-emissions.module';
import { OzoneApportionedEmissionsModule } from './ozone/ozone-apportioned-emissions.module';
import { MatsApportionedEmissionsModule } from './mats/mats-apportioned-emissions.module';
import { ApportionedEmissionsController } from './apportioned-emissions.controller';
import { ApportionedEmissionsService } from './apportioned-emissions.service';
import { ProgramYearDimRepository } from './program-year-dim.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProgramYearDimRepository]),
    HttpModule,
    HourlyApportionedEmissionsModule,
    DailyApportionedEmissionsModule,
    MonthlyApportionedEmissionsModule,
    QuarterlyApportionedEmissionsModule,
    AnnualApportionedEmissionsModule,
    OzoneApportionedEmissionsModule,
    MatsApportionedEmissionsModule,
  ],
  controllers: [ApportionedEmissionsController],
  providers: [ApportionedEmissionsService],
})
export class ApportionedEmissionsModule {}
