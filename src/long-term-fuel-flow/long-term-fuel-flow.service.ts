import { Injectable } from '@nestjs/common';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { LongTermFuelFlowDTO } from '../dto/long-term-fuel-flow.dto';
import { LongTermFuelFlowMap } from '../maps/long-term-fuel-flow.map';
import { LongTermFuelFlowRepository } from './long-term-fuel-flow.repository';

@Injectable()
export class LongTermFuelFlowService {

  constructor(
    private readonly map: LongTermFuelFlowMap,
    private readonly repository: LongTermFuelFlowRepository,
  ) {}

  async export(
    monitoringLocationIds: string[],
    params: EmissionsParamsDTO,
  ): Promise<LongTermFuelFlowDTO[]> {
    const result = await this.repository.export(
      monitoringLocationIds,
      params.year,
      params.quarter,
    );
    return this.map.many(result);
  }

  async removeNonReportedValues(longTermFuelFlowData: LongTermFuelFlowDTO[]) {
    longTermFuelFlowData.forEach(dto => {
      delete dto.id;
      delete dto.monitoringLocationId;
      delete dto.reportingPeriodId;
      delete dto.monitoringSystemRecordId;
      delete dto.calcTotalHeatInput;
      delete dto.userId;
      delete dto.addDate;
      delete dto.updateDate;
    })
  }
}
