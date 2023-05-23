import { Injectable } from '@nestjs/common';
import { DailyFuelDTO, DailyFuelImportDTO } from '../dto/daily-fuel.dto';
import { exportDailyFuelData } from '../daily-fuel-functions/export-daily-fuel-data';
import { DailyFuelWorkspaceRepository } from './daily-fuel-workspace.repository';
import { randomUUID } from 'crypto';
import { DailyFuelMap } from '../maps/daily-fuel.map';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';

export type DailyFuelWorkspaceCreate = DailyFuelImportDTO & {
  dailyEmissionId: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
  identifiers: ImportIdentifiers;
};

@Injectable()
export class DailyFuelWorkspaceService {
  constructor(
    private readonly map: DailyFuelMap,
    private readonly repository: DailyFuelWorkspaceRepository,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async export(dailyEmissionIds: string[]): Promise<DailyFuelDTO[]> {
    return exportDailyFuelData({
      dailyEmissionIds,
      repository: this.repository,
    });
  }

  async buildObjectList(
    data: DailyFuelImportDTO[],
    dailyEmissionId: string,
    monitoringLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
    objectList: Array<object>,
    currentTime: string,
  ): Promise<void> {
    for (const dataChunk of data) {
      const {
        fuelCode,
        dailyFuelFeed,
        carbonContentUsed,
        fuelCarbonBurned,
      } = dataChunk;
      objectList.push({
        id: randomUUID(),
        dailyEmissionId,
        fuelCode,
        dailyFuelFeed,
        carbonContentUsed,
        fuelCarbonBurned,
        userId: identifiers?.userId,
        addDate: currentTime,
        updateDate: currentTime,
        reportingPeriodId,
        monitoringLocationId,
      });
    }
  }

  async import(objectList: Array<object>): Promise<void> {
    if (objectList && objectList.length > 0) {
      const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
        'camdecmpswks.daily_fuel',
        [
          'daily_fuel_id',
          'daily_emission_id',
          'fuel_cd',
          'daily_fuel_feed',
          'carbon_content_used',
          'fuel_carbon_burned',
          'userid',
          'add_date',
          'update_date',
          'rpt_period_id',
          'mon_loc_id',
        ],
        '|',
      );

      for (const slice of objectList) {
        bulkLoadStream.writeObject(slice);
      }

      bulkLoadStream.complete();
      await bulkLoadStream.finished;
    }
  }
}
