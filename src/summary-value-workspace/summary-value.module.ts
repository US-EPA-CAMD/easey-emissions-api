import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SummaryValueMap } from '../maps/summary-value.map';
import { SummaryValueWorkspaceRepository } from './summary-value.repository';
import { SummaryValueWorkspaceService } from './summary-value.service';

@Module({
  imports: [TypeOrmModule.forFeature([SummaryValueWorkspaceRepository])],
  controllers: [],
  providers: [SummaryValueWorkspaceService, SummaryValueMap],
  exports: [TypeOrmModule, SummaryValueWorkspaceService, SummaryValueMap],
})
export class SummaryValueWorkspaceModule {}
