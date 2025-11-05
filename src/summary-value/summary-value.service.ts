import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import {
  SummaryValueDTO,
  SummaryValueImportDTO,
} from '../dto/summary-value.dto';
import { SummaryValueMap } from '../maps/summary-value.map';
import { SummaryValueRepository } from './summary-value.repository';

export type SummaryValueCreate = SummaryValueImportDTO & {
  reportingPeriodId: number;
  monitoringLocationId: string;
};

@Injectable()
export class SummaryValueService {

  constructor(
    private readonly dataSource: DataSource,
    private readonly map: SummaryValueMap,
    private readonly repository: SummaryValueRepository,
  ) {}

  async export(
    monitoringLocationIds: string[],
    params: EmissionsParamsDTO,
  ): Promise<SummaryValueDTO[]> {
    return withSlaveConnection(this.dataSource, async () => {
      const results = await this.repository.export(
        monitoringLocationIds,
        params.year,
        params.quarter,
      );
      return this.map.many(results);
    });
  }
}
