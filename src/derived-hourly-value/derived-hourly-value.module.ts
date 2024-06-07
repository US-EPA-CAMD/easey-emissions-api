import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { DerivedHourlyValueRepository } from './derived-hourly-value.repository';
import { DerivedHourlyValueService } from './derived-hourly-value.service';

@Module({
  imports: [TypeOrmModule.forFeature([DerivedHourlyValueRepository])],
  providers: [
    DerivedHourlyValueRepository,
    DerivedHourlyValueService,
    DerivedHourlyValueMap,
  ],
  controllers: [],
  exports: [
    TypeOrmModule,
    DerivedHourlyValueRepository,
    DerivedHourlyValueService,
    DerivedHourlyValueMap,
  ],
})
export class DerivedHourlyValueModule {}
