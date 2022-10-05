import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SummaryValueDTO, SummaryValueImportDTO } from '../dto/summary-value.dto';
import { SummaryValueMap } from '../maps/summary-value.map';
import { SummaryValueWorkspaceRepository } from './summary-value.repository';

export type SummaryValueCreate = SummaryValueImportDTO & {
    reportingPeriodId: number;
    monitoringLocationId: string;
  };
  
@Injectable()
export class SummaryValueService {
  constructor(
    private readonly map: SummaryValueMap,
    private readonly repository: SummaryValueWorkspaceRepository,
  ) {}

  async import(
    data: SummaryValueCreate,
  ): Promise<SummaryValueDTO> {
    const entity = this.repository.create({
        ...data,
        id: randomUUID(),
      });
    
    const result = await this.repository.save(entity);

    return this.map.one(result);
  }
}
