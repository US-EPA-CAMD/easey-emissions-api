import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Nsps4tAnnualRepository } from './nsps4t-annual.repository';
import { Nsps4tAnnualService } from './nsps4t-annual.service';

@Module({
  imports: [TypeOrmModule.forFeature([Nsps4tAnnualRepository])],
  providers: [Nsps4tAnnualRepository, Nsps4tAnnualService],
})
export class Nsps4tAnnualModule {}
