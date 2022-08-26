import { Module } from '@nestjs/common';
import { DerivedHourlyValueWorkspaceService } from './derived-hourly-value-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DerivedHourlyValueWorkspaceRepository } from './derived-hourly-value-workspace.repository';
import { DerivedHourlyValueWorkspaceMap } from './derived-hourly-value-workspace.map';

@Module({
  imports: [TypeOrmModule.forFeature([DerivedHourlyValueWorkspaceRepository])],
  providers: [
    DerivedHourlyValueWorkspaceService,
    DerivedHourlyValueWorkspaceMap,
  ],
})
export class DerivedHourlyValueWorkspaceModule {}
