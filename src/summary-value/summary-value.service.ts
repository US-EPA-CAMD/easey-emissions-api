import { Injectable } from '@nestjs/common';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import {
  SummaryValueDTO,
  SummaryValueImportDTO,
} from '../dto/summary-value.dto';
import { SummaryValueMap } from '../maps/summary-value.map';
import { SummaryValueRepository } from './summary-value.repository';
import { exportSupplementarySummaryValues } from '../summary-value-functions/summary-value-export';
import { SummaryValueParamsDto } from '../dto/summary-value-params.dto';

export type SummaryValueCreate = SummaryValueImportDTO & {
  reportingPeriodId: number;
  monitoringLocationId: string;
};

@Injectable()
export class SummaryValueService {

  constructor(
    private readonly map: SummaryValueMap,
    private readonly repository: SummaryValueRepository,
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

  async supplementaryExport(
    params: SummaryValueParamsDto,
  ): Promise<SummaryValueDTO[]> {
    return exportSupplementarySummaryValues(
      {
        ...params,
      },
      this.repository,
    );
  }
}
