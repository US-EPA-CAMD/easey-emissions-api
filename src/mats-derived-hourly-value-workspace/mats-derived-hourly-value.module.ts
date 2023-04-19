import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { MatsDerivedHourlyValueWorkspaceService } from './mats-derived-hourly-value.service';
import { MatsDerivedHourlyValueWorkspaceRepository } from './mats-derived-hourly-value.repository';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatsDerivedHourlyValueWorkspaceRepository]),
    BulkLoadModule,
  ],
  providers: [
    MatsDerivedHourlyValueMap,
    MatsDerivedHourlyValueWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    MatsDerivedHourlyValueMap,
    MatsDerivedHourlyValueWorkspaceService,
  ],
})
export class MatsDerivedHourlyValueWorkspaceModule {}
