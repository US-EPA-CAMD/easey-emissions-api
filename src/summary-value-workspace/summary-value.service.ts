import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';

import {
  SummaryValueDTO,
  SummaryValueImportDTO,
} from '../dto/summary-value.dto';
import { SummaryValueMap } from '../maps/summary-value.map';
import { SummaryValueWorkspaceRepository } from './summary-value.repository';

export type SummaryValueCreate = SummaryValueImportDTO & {
  reportingPeriodId: number;
  monitoringLocationId: string;
};

@Injectable()
export class SummaryValueWorkspaceService {
  constructor(
    private readonly map: SummaryValueMap,
    private readonly repository: SummaryValueWorkspaceRepository,
  ) {}

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

      entity = this.repository.create({ ...data, id: uniqueResults[0].id });
    } else entity = this.repository.create({ ...data, id: randomUUID() });

    const result = await this.repository.save(entity);

    return result;
  }
}
