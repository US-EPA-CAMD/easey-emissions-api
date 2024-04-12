import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BulkLoadModule,
  BulkLoadService,
} from '@us-epa-camd/easey-common/bulk-load';

import { LongTermFuelFlowMap } from '../maps/long-term-fuel-flow.map';
import { LongTermFuelFlowWorkspaceRepository } from './long-term-fuel-flow.repository';
import { LongTermFuelFlowWorkspaceService } from './long-term-fuel-flow.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LongTermFuelFlowWorkspaceRepository]),
    BulkLoadModule,
  ],
  providers: [
    LongTermFuelFlowWorkspaceRepository,
    LongTermFuelFlowWorkspaceService,
    LongTermFuelFlowMap,
    BulkLoadService,
  ],
  exports: [TypeOrmModule, LongTermFuelFlowMap, BulkLoadService],
})
export class LongTermFuelFlowWorkspaceModule {}
