import { Module } from '@nestjs/common';

import { HourlyApportionedEmissionsModule } from './hourly/hourly-apportioned-emissions.module';
import { DailyApportionedEmissionsModule } from './daily/daily-apportioned-emissions.module';
import { MonthlyApportionedEmissionsModule } from './monthly/monthly-apportioned-emissions.module';
import { QuarterlyApportionedEmissionsModule } from './quarterly/quarterly-apportioned-emissions.module';
import { AnnualApportionedEmissionsModule } from './annual/annual-apportioned-emissions.module';
import { OzoneApportionedEmissionsModule } from './ozone/ozone-apportioned-emissions.module';
import { MatsApportionedEmissionsModule } from './mats/mats-apportioned-emissions.module';

@Module({
  imports: [
    HourlyApportionedEmissionsModule,
    DailyApportionedEmissionsModule,
    MonthlyApportionedEmissionsModule,
    QuarterlyApportionedEmissionsModule,
    AnnualApportionedEmissionsModule,
    OzoneApportionedEmissionsModule,
    MatsApportionedEmissionsModule,
  ],
  controllers: [],
  providers: [],
})
export class ApportionedEmissionsModule {}
