import { Module } from '@nestjs/common';
import { HourlyOperatingDataService } from './hourly-operating-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HourlyOperatingDataRepository } from './hourly-operating-data.repository';
import { DerivedHourlyValueService } from '../derived-hourly-value/derived-hourly-value.service';
import { DerivedHourlyValueRepository } from '../derived-hourly-value/derived-hourly-value.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DerivedHourlyValueRepository,
      HourlyOperatingDataRepository,
    ]),
  ],
  providers: [DerivedHourlyValueService, HourlyOperatingDataService],
})
export class HourlyOperatingDataModule {}
