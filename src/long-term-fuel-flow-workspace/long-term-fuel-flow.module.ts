import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LongTermFuelFlowWorkspaceRepository } from './long-term-fuel-flow.repository';
import { LongTermFuelFlowWorkspaceService } from './long-term-fuel-flow.service';
import { LongTermFuelFlowMap } from '../maps/long-term-fuel-flow.map';
import {
  BulkLoadModule,
  BulkLoadService,
} from '@us-epa-camd/easey-common/bulk-load';

@Module({
  imports: [
    TypeOrmModule.forFeature([LongTermFuelFlowWorkspaceRepository]),
    BulkLoadModule,
  ],
  providers: [
    LongTermFuelFlowWorkspaceService,
    LongTermFuelFlowMap,
    BulkLoadService,
  ],
  exports: [TypeOrmModule, LongTermFuelFlowMap, BulkLoadService],
})
export class LongTermFuelFlowWorkspaceModule {}
