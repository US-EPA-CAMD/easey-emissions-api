import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { MatsDerivedHourlyValueService } from './mats-derived-hourly-value.service';
import { MatsDerivedHourlyValueRepository } from './mats-derived-hourly-value.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MatsDerivedHourlyValueRepository])],
  providers: [MatsDerivedHourlyValueMap, MatsDerivedHourlyValueService],
  exports: [
    TypeOrmModule,
    MatsDerivedHourlyValueMap,
    MatsDerivedHourlyValueService,
  ],
})
export class MatsDerivedHourlyValueModule {}
