import { Injectable } from '@nestjs/common';
import { DerivedHourlyValueWorkspaceRepository } from './derived-hourly-value-workspace.repository';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { randomUUID } from 'crypto';
import { DerivedHourlyValueImportDTO } from '../dto/derived-hourly-value.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';

@Injectable()
export class DerivedHourlyValueWorkspaceService {
  constructor(
    private readonly repository: DerivedHourlyValueWorkspaceRepository,
    private readonly map: DerivedHourlyValueMap,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async export(hourIds: string[]) {
    const derivedHourlyValueData = await this.repository.export(hourIds);

    const promises = derivedHourlyValueData?.map(data => {
      return this.map.one(data);
    });

    return Promise.all(promises);
  }

  async import(
    data: DerivedHourlyValueImportDTO[],
    hourId: string,
    monitorLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
  ): Promise<void> {
    if (data && data.length > 0) {
      const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
        'camdecmpswks.derived_hrly_value',
      );

      for (const dataChunk of data) {
        bulkLoadStream.writeObject({
          id: randomUUID(),
          hourId: hourId,
          monSysId:
            identifiers?.monitoringSystems?.[dataChunk.monitoringSystemId] ||
            null,
          monFormId:
            identifiers?.monitorFormulas?.[dataChunk.formulaIdentifier] || null,
          parameterCode: dataChunk.parameterCode,
          unadjustedHrlyValue: dataChunk.unadjustedHourlyValue,
          applicableBiasAdj: null,
          calcUnAdjHrlyValue: null,
          adjustedHourlyValue: dataChunk.adjustedHourlyValue,
          calcAdjustedHourlyValue: null,
          modcCd: dataChunk.modcCode,
          opConditionCode: dataChunk.operatingConditionCode,
          pctAvailable: dataChunk.percentAvailable,
          diluent: null,
          segmentNum: dataChunk.segmentNumber,
          fuelCd: dataChunk.fuelCode,
          userId: identifiers?.userId,
          addDate: new Date().toISOString(),
          updateDate: new Date().toISOString(),
          calcPctDiluent: null,
          calcPctMoisture: null,
          calcRata: null,
          calcAppe: null,
          rptPeriod: reportingPeriodId,
          monLocId: monitorLocationId,
          calcFuelFlowTotal: null,
          calcHourMEasureCd: null,
        });
      }

      bulkLoadStream.complete();
      await bulkLoadStream.finished;
    }
  }
}
