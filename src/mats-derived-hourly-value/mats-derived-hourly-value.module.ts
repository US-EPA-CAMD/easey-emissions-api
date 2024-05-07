import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { MatsDerivedHourlyValueRepository } from './mats-derived-hourly-value.repository';
import { MatsDerivedHourlyValueService } from './mats-derived-hourly-value.service';

@Module({
  imports: [TypeOrmModule.forFeature([MatsDerivedHourlyValueRepository])],
  providers: [
    MatsDerivedHourlyValueMap,
    MatsDerivedHourlyValueRepository,
    MatsDerivedHourlyValueService,
  ],
  exports: [
    TypeOrmModule,
    MatsDerivedHourlyValueMap,
    MatsDerivedHourlyValueService,
  ],
})
export class MatsDerivedHourlyValueModule {}
