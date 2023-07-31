import { Injectable } from '@nestjs/common';
import { DailyFuelDTO } from '../dto/daily-fuel.dto';
import { DailyFuelRepository } from './daily-fuel.repository';
import { exportDailyFuelData } from '../daily-fuel-functions/export-daily-fuel-data';

@Injectable()
export class DailyFuelService {

  constructor(private readonly repository: DailyFuelRepository) {}

  async export(dailyEmissionIds: string[]): Promise<DailyFuelDTO[]> {
    return exportDailyFuelData({
      dailyEmissionIds,
      repository: this.repository,
    });//
  }
}
