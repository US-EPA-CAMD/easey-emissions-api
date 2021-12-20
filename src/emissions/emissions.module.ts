import { Module } from '@nestjs/common';
import { EmissionController } from './emissions.controller';
import { EmissionService } from './emissions.service';
import { EmissionSubmissionsProgressMap } from '../maps/emissions-submission-progress.map';

@Module({
  controllers: [EmissionController],
  providers: [EmissionService, EmissionSubmissionsProgressMap],
})
export class EmissionsModule {}
