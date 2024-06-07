import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { DerivedHourlyValueWorkspaceRepository } from './derived-hourly-value-workspace.repository';
import { DerivedHourlyValueWorkspaceService } from './derived-hourly-value-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DerivedHourlyValueWorkspaceRepository]),
    BulkLoadModule,
  ],
  providers: [
    DerivedHourlyValueWorkspaceRepository,
    DerivedHourlyValueWorkspaceService,
    DerivedHourlyValueMap,
  ],
  exports: [
    TypeOrmModule,
    DerivedHourlyValueWorkspaceRepository,
    DerivedHourlyValueWorkspaceService,
    DerivedHourlyValueMap,
  ],
})
export class DerivedHourlyValueWorkspaceModule {}
