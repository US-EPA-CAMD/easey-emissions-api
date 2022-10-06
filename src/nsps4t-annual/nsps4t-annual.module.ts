import { Module } from '@nestjs/common';
import { Nsps4tAnnualService } from './nsps4t-annual.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nsps4tAnnualRepository } from './nsps4t-annual.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Nsps4tAnnualRepository])],
  providers: [Nsps4tAnnualService],
})
export class Nsps4tAnnualModule {}
