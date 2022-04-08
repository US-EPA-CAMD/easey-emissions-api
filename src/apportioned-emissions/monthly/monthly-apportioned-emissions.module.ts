import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthlyApportionedEmissionsService } from './monthly-apportioned-emissions.service';
import { MonthlyApportionedEmissionsController } from './monthly-apportioned-emissions.controller';
import { StreamModule } from '@us-epa-camd/easey-common/stream';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonthUnitDataRepository]),
    HttpModule,
    StreamModule,
  ],
  controllers: [MonthlyApportionedEmissionsController],
  providers: [ConfigService, MonthlyApportionedEmissionsService],
  exports: [TypeOrmModule],
})
export class MonthlyApportionedEmissionsModule {}
