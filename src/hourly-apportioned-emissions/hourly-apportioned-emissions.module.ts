import { Module } from '@nestjs/common';
import { HourlyApportionedEmissionsController } from './hourly-apportioned-emissions.controller';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';

@Module({
  controllers: [HourlyApportionedEmissionsController],
  providers: [HourlyApportionedEmissionsService],
})
export class HourlyApportionedEmissionsModule {}
