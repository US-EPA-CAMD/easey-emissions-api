import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LongTermFuelFlowWorkspaceRepository } from './long-term-fuel-flow.repository';
import { LongTermFuelFlowWorkspaceService } from './long-term-fuel-flow.service';
@Module({
  imports: [TypeOrmModule.forFeature([LongTermFuelFlowWorkspaceRepository])],
  providers: [LongTermFuelFlowWorkspaceService],
})
export class LongTermFuelFlowWorkspaceModule {}
