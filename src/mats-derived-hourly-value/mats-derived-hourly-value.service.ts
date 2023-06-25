import { Injectable } from '@nestjs/common';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { MatsDerivedHourlyValueRepository } from './mats-derived-hourly-value.repository';
import { MatsDerivedHourlyValueDTO } from 'src/dto/mats-derived-hourly-value.dto';

@Injectable()
export class MatsDerivedHourlyValueService {

  constructor(
    private readonly map: MatsDerivedHourlyValueMap,
    private readonly repository: MatsDerivedHourlyValueRepository,
  ) {}

  async export(hourIds: string[]) {
    const matsDerivedHourlyValueData = await this.repository.export(hourIds);
    return this.map.many(matsDerivedHourlyValueData);
  }

  async removeNonReportedValues(matsDerivedHourlyValueData: MatsDerivedHourlyValueDTO[]) {
    matsDerivedHourlyValueData.forEach(dto => {
      delete dto.id;
      delete dto.hourId;
      delete dto.reportingPeriodId;
      delete dto.monitoringLocationId;
      delete dto.monitoringFormulaRecordId;
      delete dto.calcPctDiluent;
      delete dto.calcPctMoisture;
      delete dto.calcUnadjustedHrlyValue;
      delete dto.userId;
      delete dto.addDate;
      delete dto.updateDate;
    })
  }
}
