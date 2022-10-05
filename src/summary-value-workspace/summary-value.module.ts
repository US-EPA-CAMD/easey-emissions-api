import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SummaryValueMap } from '../maps/summary-value.map';
import { SummaryValueWorkspaceRepository } from './summary-value.repository';
    import { SummaryValueService } from './summary-value.service';

@Module({
  imports: [TypeOrmModule.forFeature([SummaryValueWorkspaceRepository])],
  controllers: [],
  providers: [ SummaryValueService, SummaryValueMap],
  exports: [
    TypeOrmModule,
    SummaryValueService,
    SummaryValueMap
  ],
})
export class SummaryValueWorkspaceModule {}
