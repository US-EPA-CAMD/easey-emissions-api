import { Injectable } from '@nestjs/common';
import { HourlyFuelFlowRepository } from './hourly-fuel-flow.repository';
import { HourlyFuelFlowDTO } from '../dto/hourly-fuel-flow.dto';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowService } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.service';
import { HourlyParamFuelFlowDTO } from 'src/dto/hourly-param-fuel-flow.dto';

@Injectable()
export class HourlyFuelFlowService {
  constructor(
    private readonly repository: HourlyFuelFlowRepository,
    private readonly map: HourlyFuelFlowMap,
    private readonly hourlyParameterFuelFlowService: HourlyParameterFuelFlowService,
  ) {}

  async export(hourlyOperatingIds: string[]): Promise<HourlyFuelFlowDTO[]> {
    if (!Array.isArray(hourlyOperatingIds) || hourlyOperatingIds.length < 1) {
      return [];
    }

    const hourlyFuelFlow = await this.repository.export(hourlyOperatingIds);

    if (!Array.isArray(hourlyFuelFlow) || hourlyFuelFlow.length < 1) {
      return [];
    }

    const mapped = await this.map.many(hourlyFuelFlow);

    const mappedIds = mapped.map(el => el.id);

    if (mappedIds.length > 0) {
      const hourlyParamFuelFlowData = await this.hourlyParameterFuelFlowService.export(
        mappedIds,
      );

      this.organizeData(mapped, hourlyParamFuelFlowData);
    }

    return mapped;
  }

  private organizeData(
    parentArray: HourlyFuelFlowDTO[],
    childArray: HourlyParamFuelFlowDTO[],
  ) {
    const parentMap = new Map();

    parentArray.forEach(parentObj => {
      parentMap.set(parentObj.id, parentObj);
      parentObj.hourlyParameterFuelFlowData = [];
    });

    childArray.forEach(childObj => {
      const parentId = childObj.hourlyFuelFlowId;
      if (parentMap.has(parentId)) {
        const parentObj = parentMap.get(parentId);
        parentObj.hourlyParameterFuelFlowData.push(childObj);
      }
    });
  }
}
