import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmissionsSubmissionsProgressMap } from '../maps/emissions-submissions-progress.map';
import { EmissionsSubmissionsProgressRepository } from './emissions-submissions-progress.repository';
import { EmissionsController } from './emissions.controller';
import { EmissionsService } from './emissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmissionsSubmissionsProgressRepository])],
  controllers: [EmissionsController],
  providers: [
    EmissionsSubmissionsProgressRepository,
    EmissionsService,
    EmissionsSubmissionsProgressMap,
  ],
})
export class EmissionsModule {}
