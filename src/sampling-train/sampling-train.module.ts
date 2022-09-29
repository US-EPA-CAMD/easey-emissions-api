import { Module } from '@nestjs/common';
import { SamplingTrainService } from './sampling-train.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SamplingTrainRepository } from './sampling-train.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SamplingTrainRepository])],
  providers: [SamplingTrainService],
})
export class SamplingTrainModule {}
