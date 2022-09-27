import { Module } from '@nestjs/common';
import { DailyEmissionService } from './daily-emission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyEmissionRepository } from './daily-emission.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DailyEmissionRepository])],
  providers: [DailyEmissionService],
})
export class DailyEmissionModule {}
