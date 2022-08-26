import { Module } from '@nestjs/common';
import { DerivedHourlyValueWorkspaceService } from './derived-hourly-value-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DerivedHourlyValueWorkspaceRepository } from './derived-hourly-value-workspace.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DerivedHourlyValueWorkspaceRepository])],
  providers: [DerivedHourlyValueWorkspaceService],
})
export class DerivedHourlyValueWorkspaceModule {}
