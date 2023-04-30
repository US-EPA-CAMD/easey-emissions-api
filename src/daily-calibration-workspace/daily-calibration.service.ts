import { Injectable } from '@nestjs/common';
import { DeleteResult, In } from 'typeorm';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';

import {
  DailyCalibrationDTO,
  DailyCalibrationImportDTO,
} from '../dto/daily-calibration.dto';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyCalibrationWorkspaceRepository } from './daily-calibration.repository';
import { randomUUID } from 'crypto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';

export type DailyCalibrationCreate = DailyCalibrationImportDTO & {
  dailyTestSummaryId: string;
  reportingPeriodId: number;
  identifiers: ImportIdentifiers;
};

@Injectable()
export class DailyCalibrationWorkspaceService {
  constructor(
    private readonly map: DailyCalibrationMap,
    private readonly repository: DailyCalibrationWorkspaceRepository,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async dailyCalibrationByTestSumId(
    dailyTestSummaryIds: string[],
  ): Promise<DailyCalibrationDTO[]> {
    const results = await this.repository.find({
      where: { dailyTestSummaryId: In(dailyTestSummaryIds) },
    });

    if (!results) {
      return null;
    }

    return this.map.many(results);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.repository.delete({
      id,
    });
  }

  async export(dailyTestSummaryIds: string[]): Promise<DailyCalibrationDTO[]> {
    return this.dailyCalibrationByTestSumId(dailyTestSummaryIds);
  }

  async import(
    data: DailyCalibrationImportDTO[],
    dailyTestSumId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
  ): Promise<void> {
    if (data && data.length > 0) {
      const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
        'camdecmpswks.daily_calibration', null, '|',
      );

      for (const dataChunk of data) {
        bulkLoadStream.writeObject({
          id: randomUUID(),
          dailyTestSumId: dailyTestSumId,
          onlineOfflineInd: dataChunk.onLineOffLineIndicator,
          calcOnlineOfflineInd: null,
          upscaleGasLevelCode: dataChunk.upscaleGasCode,
          zeroInjectionDate: dataChunk.zeroInjectionDate,
          zeroInjectionHour: dataChunk.zeroInjectionHour,
          zeroInjectionMin: dataChunk.zeroInjectionMinute,
          upscaleInjectionDate: dataChunk.upscaleInjectionDate,
          upscaleInjectionHour: dataChunk.upscaleInjectionHour,
          upscaleInjectionMin: dataChunk.upscaleInjectionMinute,
          zeroMeasuredValue: dataChunk.zeroMeasuredValue,
          upscaleMeasuredValue: dataChunk.upscaleMeasuredValue,
          zeroApsInd: dataChunk.zeroAPSIndicator,
          calcZeroApsInd: null,
          upscaleApsInd: dataChunk.upscaleAPSIndicator,
          calcUpscaleApsInd: null,
          zeroCalError: dataChunk.zeroCalibrationError,
          calcZeroCalError: null,
          upscaleCalError: dataChunk.upscaleCalibrationError,
          calcUpscaleCalError: null,
          zeroRefValue: dataChunk.zeroReferenceValue,
          upscaleRefValue: dataChunk.upscaleReferenceValue,
          userId: identifiers?.userId,
          addDate: new Date().toISOString(),
          updateDate: new Date().toISOString(),
          rptPeriodId: reportingPeriodId,
          upscaleGasTypeCd: dataChunk.upscaleGasTypeCode,
          vendorId: dataChunk.vendorIdentifier,
          cylinderIdentifier: dataChunk.cylinderIdentifier,
          expirationDate: dataChunk.expirationDate,
          injectionProtocolCd: dataChunk.injectionProtocolCode,
        });
      }

      bulkLoadStream.complete();
      await bulkLoadStream.finished;
    }
  }
}
