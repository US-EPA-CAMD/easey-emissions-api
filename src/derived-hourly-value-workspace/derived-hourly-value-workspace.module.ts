import { Module } from '@nestjs/common';
import { DerivedHourlyValueWorkspaceService } from './derived-hourly-value-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DerivedHourlyValueWorkspaceRepository } from './derived-hourly-value-workspace.repository';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

@Module({
  imports: [
    TypeOrmModule.forFeature([DerivedHourlyValueWorkspaceRepository]),
    BulkLoadModule,
  ],
  providers: [DerivedHourlyValueWorkspaceService, DerivedHourlyValueMap],
})
export class DerivedHourlyValueWorkspaceModule {}
