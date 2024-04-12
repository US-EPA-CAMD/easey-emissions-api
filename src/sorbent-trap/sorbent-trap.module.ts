import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SamplingTrainRepository } from '../sampling-train/sampling-train.repository';
import { SamplingTrainService } from '../sampling-train/sampling-train.service';
import { SorbentTrapRepository } from './sorbent-trap.repository';
import { SorbentTrapService } from './sorbent-trap.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SamplingTrainRepository, SorbentTrapRepository]),
  ],
  providers: [
    SamplingTrainRepository,
    SamplingTrainService,
    SorbentTrapRepository,
    SorbentTrapService,
  ],
})
export class SorbentTrapModule {}
