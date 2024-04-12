import { Injectable } from '@nestjs/common';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { randomUUID } from 'crypto';
import { DeleteResult } from 'typeorm';

import { EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import {
  SummaryValueDTO,
  SummaryValueImportDTO,
} from '../dto/summary-value.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { SummaryValueMap } from '../maps/summary-value.map';
import { SummaryValueWorkspaceRepository } from './summary-value.repository';

export type SummaryValueCreate = SummaryValueImportDTO & {
  reportingPeriodId: number;
  monitoringLocationId: string;
  identifiers: ImportIdentifiers;
};

@Injectable()
export class SummaryValueWorkspaceService {
  constructor(
    private readonly map: SummaryValueMap,
    private readonly repository: SummaryValueWorkspaceRepository,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async delete(
    criteria: Parameters<typeof this.repository.delete>[0],
  ): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }

  async export(
    monitoringLocationIds: string[],
    params: EmissionsParamsDTO,
  ): Promise<SummaryValueDTO[]> {
    const results = await this.repository.export(
      monitoringLocationIds,
      params.year,
      params.quarter,
    );

    return this.map.many(results);
  }

  async import(
    emissionsImport: EmissionsImportDTO,
    monitoringLocations,
    reportingPeriodId,
    identifiers: ImportIdentifiers,
    currentTime: string,
  ): Promise<void> {
    if (
      !Array.isArray(emissionsImport?.summaryValueData) ||
      emissionsImport?.summaryValueData.length === 0
    ) {
      return;
    }

    const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
      'camdecmpswks.summary_value',
      [
        'sum_value_id',
        'rpt_period_id',
        'mon_loc_id',
        'parameter_cd',
        'current_rpt_period_total',
        'os_total',
        'year_total',
        'userid',
        'add_date',
        'update_date',
      ],
    );

    for (const summaryValueDatum of emissionsImport.summaryValueData) {
      const monitoringLocationId = monitoringLocations.filter(location => {
        return (
          location.unit?.name === summaryValueDatum.unitId ||
          location.stackPipe?.name === summaryValueDatum.stackPipeId
        );
      })[0].id;

      const uid = randomUUID();
      summaryValueDatum['id'] = uid;

      const {
        parameterCode,
        currentReportingPeriodTotal,
        ozoneSeasonToDateTotal,
        yearToDateTotal,
      } = summaryValueDatum;

      bulkLoadStream.writeObject({
        uid,
        reportingPeriodId,
        monitoringLocationId,
        parameterCode,
        currentReportingPeriodTotal,
        ozoneSeasonToDateTotal,
        yearToDateTotal,
        userId: identifiers?.userId,
        addDate: currentTime,
        updateDate: currentTime,
      });
    }

    bulkLoadStream.complete();
    await bulkLoadStream.finished;
  }
}
