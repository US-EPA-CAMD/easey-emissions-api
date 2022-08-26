import { Injectable } from '@nestjs/common';
import { HourlyOperatingDataRepository } from './hourly-operating-data.repository';
import { DerivedHourlyValueService } from '../derived-hourly-value/derived-hourly-value.service';
import { isUndefinedOrNull } from '../utils/utils';

@Injectable()
export class HourlyOperatingDataService {
  constructor(
    private readonly repository: HourlyOperatingDataRepository,
    private readonly derivedHourlyValueService: DerivedHourlyValueService,
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
