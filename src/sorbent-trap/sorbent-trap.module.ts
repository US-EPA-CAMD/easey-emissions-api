import { Module } from '@nestjs/common';
import { SorbentTrapService } from './sorbent-trap.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SorbentTrapRepository } from './sorbent-trap.repository';
import { SamplingTrainService } from '../sampling-train/sampling-train.service';
import { SamplingTrainRepository } from '../sampling-train/sampling-train.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SamplingTrainRepository, SorbentTrapRepository]),
  ],
  providers: [SamplingTrainService, SorbentTrapService],
})
export class SorbentTrapModule {}
