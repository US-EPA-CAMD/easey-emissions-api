import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SamplingTrainRepository } from './sampling-train.repository';
import { SamplingTrainService } from './sampling-train.service';

@Module({
  imports: [TypeOrmModule.forFeature([SamplingTrainRepository])],
  providers: [SamplingTrainRepository, SamplingTrainService],
})
export class SamplingTrainModule {}
