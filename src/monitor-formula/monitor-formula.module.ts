import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorFormulaRepository } from './monitor-formula.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorFormulaRepository])],
  providers: [MonitorFormulaRepository],
  exports: [TypeOrmModule, MonitorFormulaRepository],
})
export class MonitorFormulaModule {}
