import { Injectable } from '@nestjs/common';

import { MatsMonitorHourlyValueRepository } from './mats-monitor-hourly-value.repository';
import { MatsMonitorHourlyValueDTO } from '../dto/mats-monitor-hourly-value.dto';
import { MatsMonitorHourlyValueMap } from '../maps/mats-monitor-hourly-value.map';

@Injectable()
export class MatsMonitorHourlyValueService {

  constructor(
    private readonly map: MatsMonitorHourlyValueMap,
    private readonly repository: MatsMonitorHourlyValueRepository,
  ) {}

  async export(hourIds: string[]): Promise<MatsMonitorHourlyValueDTO[]> {
    const results = await this.repository.export(hourIds);
    return this.map.many(results);
  }

  async removeNonReportedValues(matsMonitorHourlyValueData: MatsMonitorHourlyValueDTO[]) {
    matsMonitorHourlyValueData.forEach(dto => {
      delete dto.id;
      delete dto.hourId;
      delete dto.reportingPeriodId;
      delete dto.monitoringLocationId;
      delete dto.monitoringSystemRecordId;
      delete dto.componentRecordId;
      delete dto.calcUnadjustedHrlyValue;
      delete dto.calcDailyCalStatus;
      delete dto.calcHgLineStatus;
      delete dto.calcHgi1Status;
      delete dto.calcRataStatus;
      delete dto.userId;
      delete dto.addDate;
      delete dto.updateDate;
    })
  }
}
