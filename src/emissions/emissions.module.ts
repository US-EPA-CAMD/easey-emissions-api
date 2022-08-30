import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmissionsController } from './emissions.controller';
import { EmissionsService } from './emissions.service';
import { EmissionsSubmissionsProgressRepository } from './emissions-submissions-progress.repository';
import { EmissionsSubmissionsProgressMap } from '../maps/emissions-submissions-progress.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmissionsSubmissionsProgressRepository,
    ]),
  ],
  controllers: [EmissionsController],
  providers: [
    EmissionsService,
    EmissionsSubmissionsProgressMap,
  ],
})
export class EmissionsModule {}
