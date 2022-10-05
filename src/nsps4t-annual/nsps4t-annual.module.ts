import { Module } from '@nestjs/common';
import { Nsps4tAnnualService } from './nsps4t-annual.service';

@Module({
  providers: [Nsps4tAnnualService],
})
export class Nsps4tAnnualModule {}
