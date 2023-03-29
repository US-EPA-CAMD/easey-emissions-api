import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SummaryValue } from '../entities/workspace/summary-value.entity';
import { DeleteResult, FindConditions } from 'typeorm';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';

import {
  SummaryValueDTO,
  SummaryValueImportDTO,
} from '../dto/summary-value.dto';
import { SummaryValueMap } from '../maps/summary-value.map';
import { SummaryValueWorkspaceRepository } from './summary-value.repository';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';

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

  async import(data: SummaryValueCreate): Promise<SummaryValueDTO> {
    await this.delete({monitoringLocationId: data.monitoringLocationId, reportingPeriodId: data.reportingPeriodId})
    const uniqueResults = await this.repository.find({
      where: {
        reportingPeriodId: data.reportingPeriodId,
        monitoringLocationId: data.monitoringLocationId,
        parameterCode: data.parameterCode,
      },
    });

    let entity;
    if (uniqueResults.length > 0) {
      data.reportingPeriodId = undefined;
      data.monitoringLocationId = undefined;
      data.parameterCode = undefined;

      entity = this.repository.create({
        ...data,
        id: uniqueResults[0].id,
        addDate: new Date(),
        updateDate: new Date(),
        userId: data.identifiers?.userId,
      });
    } else
      entity = this.repository.create({
        ...data,
        id: randomUUID(),
        addDate: new Date(),
        updateDate: new Date(),
        userId: data.identifiers?.userId,
      });

    const result = await this.repository.save(entity);

    return result;
  }
}
