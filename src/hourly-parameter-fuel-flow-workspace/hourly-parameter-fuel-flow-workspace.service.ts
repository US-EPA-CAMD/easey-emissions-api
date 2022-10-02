import { Injectable } from '@nestjs/common';
import { HourlyParameterFuelFlowWorkspaceRepository } from './hourly-parameter-fuel-flow-workspace.repository';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import {
  HourlyParamFuelFlowDTO,
  HourlyParamFuelFlowImportDTO,
} from '../dto/hourly-param-fuel-flow.dto';
import { ImportIdentifiers } from 'src/emissions-workspace/emissions.service';
import { randomUUID } from 'crypto';

@Injectable()
export class HourlyParameterFuelFlowWorkspaceService {
  constructor(
    private readonly map: HourlyParameterFuelFlowMap,
    private readonly repository: HourlyParameterFuelFlowWorkspaceRepository,
  ) {}

  async export(hourlyFuelFlowId: string): Promise<HourlyParamFuelFlowDTO[]> {
    const hrlyParams = await this.repository.export(hourlyFuelFlowId);

    return this.map.many(hrlyParams);
  }

  async import(
    data: HourlyParamFuelFlowImportDTO,
    hourlyFuelFlowId: string,
    monitoringLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
  ) {
    return this.repository.save(
      this.repository.create({
        id: randomUUID(),
        hourlyFuelFlowId,
        parameterCode: data.parameterCode,
        parameterValueForFuel: data.parameterValueForFuel,
        formulaIdentifier:
          identifiers.monitorFormulas?.[data.formulaIdentifier],
        sampleTypeCode: data.sampleTypeCode,
        monitoringSystemId:
          identifiers.monitoringSystems?.[data.monitoringSystemId],
        operatingConditionCode: data.operatingConditionCode,
        segmentNumber: data.segmentNumber,
        parameterUomCode: data.parameterUomCode,
        monitoringLocationId: monitoringLocationId,
        reportingPeriodId: reportingPeriodId,
      }),
    );
  }
}
