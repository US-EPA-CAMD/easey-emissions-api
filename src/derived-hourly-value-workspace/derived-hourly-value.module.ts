import { Module } from '@nestjs/common';
import { DerivedHourlyValueService } from './derived-hourly-value.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DerivedHourlyValueRepository } from './derived-hourly-value.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DerivedHourlyValueRepository])],
  providers: [DerivedHourlyValueService],
})
export class DerivedHourlyValueModule {}
