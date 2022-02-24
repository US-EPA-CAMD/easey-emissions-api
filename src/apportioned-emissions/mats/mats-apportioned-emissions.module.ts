import { Module } from '@nestjs/common';

import { HourlyMatsApportionedEmissionsModule } from './hourly/hourly-mats-apportioned-emissions.module';

@Module({
  imports: [HourlyMatsApportionedEmissionsModule],
  controllers: [],
  providers: [],
})
export class MatsApportionedEmissionsModule {}
