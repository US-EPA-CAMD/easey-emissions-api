import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SamplingTrainModule } from '../sampling-train/sampling-train.module';
import { SorbentTrapRepository } from './sorbent-trap.repository';
import { SorbentTrapService } from './sorbent-trap.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SorbentTrapRepository]),
    SamplingTrainModule,
  ],
  providers: [SorbentTrapRepository, SorbentTrapService],
  exports: [TypeOrmModule, SorbentTrapRepository, SorbentTrapService],
})
export class SorbentTrapModule {}
