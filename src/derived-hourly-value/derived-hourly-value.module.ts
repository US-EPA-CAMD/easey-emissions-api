import { Module } from '@nestjs/common';
import { DerivedHourlyValueService } from './derived-hourly-value.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DerivedHourlyValueRepository } from './derived-hourly-value.repository';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { DerivedHourlyValueController } from './derived-hourly-value.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DerivedHourlyValueRepository])],
  providers: [DerivedHourlyValueService, DerivedHourlyValueMap],
  controllers: [DerivedHourlyValueController],
})
export class DerivedHourlyValueModule {}
