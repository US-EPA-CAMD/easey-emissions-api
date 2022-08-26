import { Injectable } from '@nestjs/common';
import { HourlyOperatingDataWorkspaceRepository } from './hourly-operating-data-workspace.repository';
import { DerivedHourlyValueWorkspaceService } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.service';
import { isUndefinedOrNull } from '../utils/utils';

@Injectable()
export class HourlyOperatingDataWorkspaceService {
  constructor(
    private readonly repository: HourlyOperatingDataWorkspaceRepository,
    private readonly derivedHourlyValueService: DerivedHourlyValueWorkspaceService,
  ) {}

  async export(monitoringLocationIds: string[]) {
    const hourlyOperatingData = await this.repository.export(
      monitoringLocationIds,
    );

    if (
      !isUndefinedOrNull(hourlyOperatingData) &&
      Array.isArray(hourlyOperatingData)
    ) {
      for (const datum of hourlyOperatingData) {
        datum.derivedHrlyValues = await this.derivedHourlyValueService.export(
          monitoringLocationIds,
        );
      }
    }

    return hourlyOperatingData;
  }
}
