import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
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

  async import(data: SummaryValueCreate): Promise<SummaryValueDTO> {
    const result = await this.repository.save(
      this.repository.create({
        ...data,
        id: randomUUID(),
      }),
    );

    return this.map.one(result);
  }
}
