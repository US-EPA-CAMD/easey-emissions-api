import { Injectable } from '@nestjs/common';
import { HourlyParameterFuelFlowRepository } from './hourly-parameter-fuel-flow.repository';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { HourlyParamFuelFlowDTO } from '../dto/hourly-param-fuel-flow.dto';

@Injectable()
export class HourlyParameterFuelFlowService {

  constructor(
    private readonly map: HourlyParameterFuelFlowMap,
    private readonly repository: HourlyParameterFuelFlowRepository,
  ) {}

  async export(hourlyFuelFlowId: string): Promise<HourlyParamFuelFlowDTO[]> {
    const hrlyParams = await this.repository.export(hourlyFuelFlowId);

    return this.map.many(hrlyParams);
  }

  async removeNonReportedValues(hourlyParameterFuelFlowData: HourlyParamFuelFlowDTO[]) {
    hourlyParameterFuelFlowData.forEach(dto => {
      delete dto.id;
      delete dto.hourlyFuelFlowId;
      delete dto.reportingPeriodId;
      delete dto.monitoringLocationId;
      delete dto.monitoringFormulaRecordId;
      delete dto.calcParamValFuel;
      delete dto.calcAppeStatus;
      delete dto.userId;
      delete dto.addDate;
      delete dto.updateDate;
    })
  }
}
