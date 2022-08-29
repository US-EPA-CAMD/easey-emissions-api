import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { MatsDerivedHourlyValueWorkspaceService } from './mats-derived-hourly-value.service';
import { MatsDerivedHourlyValueWorkspaceRepository } from './mats-derived-hourly-value.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatsDerivedHourlyValueWorkspaceRepository]),
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
