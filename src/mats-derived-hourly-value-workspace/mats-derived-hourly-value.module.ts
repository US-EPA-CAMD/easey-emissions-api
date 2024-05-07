import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { MatsDerivedHourlyValueWorkspaceRepository } from './mats-derived-hourly-value.repository';
import { MatsDerivedHourlyValueWorkspaceService } from './mats-derived-hourly-value.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatsDerivedHourlyValueWorkspaceRepository]),
    BulkLoadModule,
  ],
  providers: [
    MatsDerivedHourlyValueMap,
    MatsDerivedHourlyValueWorkspaceRepository,
    MatsDerivedHourlyValueWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    MatsDerivedHourlyValueMap,
    MatsDerivedHourlyValueWorkspaceService,
  ],
})
export class MatsDerivedHourlyValueWorkspaceModule {}
