import { Module } from '@nestjs/common';
import { EmissionController } from './emissions.controller';
import { EmissionService } from './emissions.service';
import { EmissionSubmissionsProgressMap } from '../maps/emissions-submission-progress.map';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmissionsRepository } from './emissions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EmissionsRepository])],
  controllers: [EmissionController],
  providers: [EmissionService, EmissionSubmissionsProgressMap],
})
export class EmissionsModule {}
