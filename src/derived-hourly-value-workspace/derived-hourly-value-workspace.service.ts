import { Injectable } from '@nestjs/common';
import { DerivedHourlyValueWorkspaceRepository } from './derived-hourly-value-workspace.repository';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { randomUUID } from 'crypto';
import { DerivedHourlyValueImportDTO } from '../dto/derived-hourly-value.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';

@Injectable()
export class DerivedHourlyValueWorkspaceService {
  constructor(
    private readonly repository: DerivedHourlyValueWorkspaceRepository,
    private readonly map: DerivedHourlyValueMap,
  ) {}

  async export(hourIds: string[]) {
    const derivedHourlyValueData = await this.repository.export(hourIds);

    const promises = derivedHourlyValueData?.map(data => {
      return this.map.one(data);
    });

    return Promise.all(promises);
  }

  async import(
    data: DerivedHourlyValueImportDTO,
    hourId: string,
    monitoringLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
  ) {
    return this.repository.save(
      this.repository.create({
        parameterCode: data.parameterCode,
        unadjustedHrlyValue: data.unadjustedHourlyValue,
        adjustedHrlyValue: data.adjustedHourlyValue,
        modcCode: data.modcCode,
        monSysId: identifiers?.monitoringSystems?.[data.monitoringSystemId],
        monFormId: identifiers?.monitorFormulas?.[data.formulaIdentifier],
        pctAvailable: data.percentAvailable,
        operatingConditionCode: data.operatingConditionCode,
        segmentNum: data.segmentNumber,
        fuelCode: data.fuelCode,
        id: randomUUID(),
        hourId,
        rptPeriodId: reportingPeriodId,
        monitorLocationId: monitoringLocationId,
        addDate: new Date(),
        updateDate: new Date(),
      }),
    );
  }
}
