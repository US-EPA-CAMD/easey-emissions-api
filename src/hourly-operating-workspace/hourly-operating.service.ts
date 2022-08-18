import { Injectable } from '@nestjs/common';

import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { HourlyOperatingDTO } from '../dto/hourly-operating.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { HourlyOperatingWorkspaceRepository } from './hourly-operating.repository';

@Injectable()
export class HourlyOperatingWorkspaceService {
  constructor(
    private readonly map: HourlyOperatingMap,
    private readonly repository: HourlyOperatingWorkspaceRepository,
  ) {}
  async getHourlyOpDataByLocationIds(
    monitoringLocationIds: string[], params: EmissionsParamsDTO
  ): Promise<HourlyOperatingDTO[]> {
    const results = await this.repository.export(monitoringLocationIds, params.year, params.quarter);

    return this.map.many(results);
  }

  async export(monitoringLocationIds: string[], params: EmissionsParamsDTO): Promise<HourlyOperatingDTO[]> {
    const hourlyOperating = await this.getHourlyOpDataByLocationIds(
      monitoringLocationIds, params
    );

    return hourlyOperating;
  }
}
