import { Module } from '@nestjs/common';
import { Nsps4tSummaryService } from './nsps4t-summary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nsps4tSummaryRepository } from './nsps4t-summary.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Nsps4tSummaryRepository])],
  providers: [Nsps4tSummaryService],
})
export class Nsps4tSummaryModule {}
