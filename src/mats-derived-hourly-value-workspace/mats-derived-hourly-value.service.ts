import { Injectable } from '@nestjs/common';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { In } from 'typeorm';
import { MatsDerivedHourlyValueWorkspaceRepository } from './mats-derived-hourly-value.repository';
import {
  MatsDerivedHourlyValueDTO,
  MatsDerivedHourlyValueImportDTO,
} from '../dto/mats-derived-hourly-value.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { randomUUID } from 'crypto';

@Injectable()
export class MatsDerivedHourlyValueWorkspaceService {
  constructor(
    private readonly map: MatsDerivedHourlyValueMap,
    private readonly repository: MatsDerivedHourlyValueWorkspaceRepository,
  ) {}

  async export(hourIds: string[]): Promise<MatsDerivedHourlyValueDTO[]> {
    const results = await this.repository.find({
      where: { hourId: In(hourIds) },
    });
    return this.map.many(results);
  }

  async import(
    data: MatsDerivedHourlyValueImportDTO,
    identifiers: ImportIdentifiers,
    hourId: string,
    monitoringLocationId: string,
    reportingPeriodId: number,
  ) {
    const o = {
      id: randomUUID(),
      parameterCode: data.parameterCode,
      unadjustedHourlyValue: data.unadjustedHourlyValue,
      modcCode: data.modcCode,
      monFormId: identifiers?.monitorFormulas?.[data.formulaIdentifier],
      hourId,
      monitoringLocationId,
      reportingPeriodId,
    };
    return this.repository.save(this.repository.create(o));
  }
}
