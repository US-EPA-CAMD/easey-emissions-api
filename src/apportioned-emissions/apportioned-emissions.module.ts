import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { StreamingModule } from '../streaming/streaming.module';
import { HourlyApportionedEmissionsModule } from './hourly/hourly-apportioned-emissions.module';
import { DailyApportionedEmissionsModule } from './daily/daily-apportioned-emissions.module';
import { MonthlyApportionedEmissionsModule } from './monthly/monthly-apportioned-emissions.module';
import { QuarterlyApportionedEmissionsModule } from './quarterly/quarterly-apportioned-emissions.module';
import { AnnualApportionedEmissionsModule } from './annual/annual-apportioned-emissions.module';
import { OzoneApportionedEmissionsModule } from './ozone/ozone-apportioned-emissions.module';

@Module({
  imports: [
    HttpModule,
    StreamingModule,
    HourlyApportionedEmissionsModule,
    DailyApportionedEmissionsModule,
    MonthlyApportionedEmissionsModule,
    QuarterlyApportionedEmissionsModule,
    AnnualApportionedEmissionsModule,
    OzoneApportionedEmissionsModule,
  ],
  controllers: [],
  providers: [],
})
export class ApportionedEmissionsModule {}
