import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SummaryValue } from '../entities/workspace/summary-value.entity';
import { DeleteResult, FindConditions } from 'typeorm';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import {
  SummaryValueDTO,
  SummaryValueImportDTO,
} from '../dto/summary-value.dto';
import { SummaryValueMap } from '../maps/summary-value.map';
import { SummaryValueWorkspaceRepository } from './summary-value.repository';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { EmissionsImportDTO } from '../dto/emissions.dto';

export type SummaryValueCreate = SummaryValueImportDTO & {
  reportingPeriodId: number;
  monitoringLocationId: string;
  identifiers: ImportIdentifiers
};

@Injectable()
export class SummaryValueWorkspaceService {
  constructor(
    private readonly map: SummaryValueMap,
    private readonly repository: SummaryValueWorkspaceRepository,
    private readonly bulkLoadService: BulkLoadService,

  ) {}

  async delete(
    criteria: FindConditions<SummaryValue>,
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
  ): Promise<void>{
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

      const {parameterCode, currentReportingPeriodTotal, 
            ozoneSeasonToDateTotal, yearToDateTotal} = summaryValueDatum;

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
//   async import(data: SummaryValueCreate): Promise<SummaryValueDTO> {
//     await this.delete({monitoringLocationId: data.monitoringLocationId, reportingPeriodId: data.reportingPeriodId})
//     const uniqueResults = await this.repository.find({
//       where: {
//         reportingPeriodId: data.reportingPeriodId,
//         monitoringLocationId: data.monitoringLocationId,
//         parameterCode: data.parameterCode,
//       },
//     });

//     let entity;
//     if (uniqueResults.length > 0) {
//       data.reportingPeriodId = undefined;
//       data.monitoringLocationId = undefined;
//       data.parameterCode = undefined;

//       entity = this.repository.create({
//         ...data,
//         id: uniqueResults[0].id,
//         addDate: new Date(),
//         updateDate: new Date(),
//         userId: data.identifiers?.userId,
//       });
//     } else
//       entity = this.repository.create({
//         ...data,
//         id: randomUUID(),
//         addDate: new Date(),
//         updateDate: new Date(),
//         userId: data.identifiers?.userId,
//       });

//     const result = await this.repository.save(entity);

//     return result;
//   }
}
