import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LongTermFuelFlowWorkspaceRepository } from './long-term-fuel-flow.repository';
import { LongTermFuelFlowWorkspaceService } from './long-term-fuel-flow.service';
import { LongTermFuelFlowMap } from '../maps/long-term-fuel-flow.map';

@Module({
  imports: [TypeOrmModule.forFeature([LongTermFuelFlowWorkspaceRepository])],
  providers: [LongTermFuelFlowWorkspaceService, LongTermFuelFlowMap],
  exports: [
    TypeOrmModule,
    LongTermFuelFlowMap,
    LongTermFuelFlowWorkspaceService,
  ],
})
export class LongTermFuelFlowWorkspaceModule {}
