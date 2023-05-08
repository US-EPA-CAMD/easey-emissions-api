import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { Nsps4tAnnualWorkspaceRepository } from './nsps4t-annual-workspace.repository';
import {
  Nsps4tAnnualDTO,
  Nsps4tAnnualImportDTO,
} from '../dto/nsps4t-annual.dto';
import { exportNsps4tAnnualData } from '../nsps4t-annual-functions/export-nsps4t-annual-data';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';

@Injectable()
export class Nsps4tAnnualWorkspaceService {
  constructor(
    private readonly repository: Nsps4tAnnualWorkspaceRepository,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async export(nsps4tSummaryIds: string[]): Promise<Nsps4tAnnualDTO[]> {
    return exportNsps4tAnnualData({
      nsps4tSummaryIds,
      repository: this.repository,
    });
  }

  async buildObjectList(
    data: Nsps4tAnnualImportDTO[],
    nsps4tSumId: string,
    monitoringLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
    objectList: Array<object>,
    currentTime: string,
  ): Promise<void> {
    for (const dataChunk of data) {
      objectList.push({
        id: randomUUID(),
        nsps4tSumId: nsps4tSumId,
        annualEnergySold: dataChunk.annualEnergySold,
        annualEnergySoldCd: dataChunk.annualEnergySoldTypeCode,
        annualPotentialOutput: dataChunk.annualPotentialElectricOutput,
        monLocId: monitoringLocationId,
        rptPeriodId: reportingPeriodId,
        userid: identifiers?.userId,
        addDate: currentTime,
        updateDate: currentTime,
      });
    }
  }

  async import(objectList: Array<object>): Promise<void> {
    if (objectList && this.buildObjectList.length > 0) {
      const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
        'camdecmpswks.nsps4t_annual',
        [
          'nsps4t_ann_id',
          'nsps4t_sum_id',
          'annual_energy_sold',
          'annual_energy_sold_type_cd',
          'annual_potential_output',
          'mon_loc_id',
          'rpt_period_id',
          'userid',
          'add_date',
          'update_date',
        ],
      );

      for (const slice of objectList) {
        bulkLoadStream.writeObject(slice);
      }

      bulkLoadStream.complete();
      await bulkLoadStream.finished;
    }
  }
}
