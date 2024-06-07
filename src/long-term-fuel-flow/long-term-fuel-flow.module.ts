import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LongTermFuelFlowMap } from '../maps/long-term-fuel-flow.map';
import { LongTermFuelFlowRepository } from './long-term-fuel-flow.repository';
import { LongTermFuelFlowService } from './long-term-fuel-flow.service';

@Module({
  imports: [TypeOrmModule.forFeature([LongTermFuelFlowRepository])],
  providers: [
    LongTermFuelFlowRepository,
    LongTermFuelFlowService,
    LongTermFuelFlowMap,
  ],
  exports: [
    TypeOrmModule,
    LongTermFuelFlowRepository,
    LongTermFuelFlowMap,
    LongTermFuelFlowService,
  ],
})
export class LongTermFuelFlowModule {}
