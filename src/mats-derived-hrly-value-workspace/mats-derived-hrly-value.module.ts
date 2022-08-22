import { Module } from '@nestjs/common';
import { MatsDerivedHrlyValueService } from './mats-derived-hrly-value.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatsDerivedHrlyValueRepository } from './mats-derived-hrly-value.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MatsDerivedHrlyValueRepository])],
  providers: [MatsDerivedHrlyValueService],
})
export class MatsDerivedHrlyValueModule {}
