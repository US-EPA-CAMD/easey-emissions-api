import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LongTermFuelFlowRepository } from './long-term-fuel-flow.repository';
import { LongTermFuelFlowService } from './long-term-fuel-flow.service';
import { LongTermFuelFlowMap } from '../maps/long-term-fuel-flow.map';
@Module({
  imports: [TypeOrmModule.forFeature([LongTermFuelFlowRepository])],
  providers: [LongTermFuelFlowService, LongTermFuelFlowMap],
  exports: [TypeOrmModule, LongTermFuelFlowMap, LongTermFuelFlowService],
})
export class LongTermFuelFlowModule {}
