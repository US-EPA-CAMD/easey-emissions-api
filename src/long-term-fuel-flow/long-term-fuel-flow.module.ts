import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LongTermFuelFlowRepository } from './long-term-fuel-flow.repository';
import { LongTermFuelFlowService } from './long-term-fuel-flow.service';
@Module({
  imports: [TypeOrmModule.forFeature([LongTermFuelFlowRepository])],
  providers: [LongTermFuelFlowService],
})
export class LongTermFuelFlowModule {}
