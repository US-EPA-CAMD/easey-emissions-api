import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SummaryValueMap } from '../maps/summary-value.map';
import { SummaryValueRepository } from './summary-value.repository';
import { SummaryValueService } from './summary-value.service';

@Module({
  imports: [TypeOrmModule.forFeature([SummaryValueRepository])],
  controllers: [],
  providers: [SummaryValueRepository, SummaryValueService, SummaryValueMap],
  exports: [TypeOrmModule, SummaryValueService, SummaryValueMap],
})
export class SummaryValueModule {}
