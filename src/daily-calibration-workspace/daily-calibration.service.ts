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

  async buildObjectList(
    data: DailyCalibrationImportDTO[],
    dailyTestSumId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
    objectList: Array<object>,
    currentTime: string,
  ): Promise<void> {
    for (const dataChunk of data) {
      objectList.push({
        id: randomUUID(),
        dailyTestSumId: dailyTestSumId,
        onlineOfflineInd: dataChunk.onLineOffLineIndicator,
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
        upscaleApsInd: dataChunk.upscaleAPSIndicator,
        zeroCalError: dataChunk.zeroCalibrationError,
        upscaleCalError: dataChunk.upscaleCalibrationError,
        zeroRefValue: dataChunk.zeroReferenceValue,
        upscaleRefValue: dataChunk.upscaleReferenceValue,
        userId: identifiers?.userId,
        addDate: currentTime,
        updateDate: currentTime,
        rptPeriodId: reportingPeriodId,
        upscaleGasTypeCd: dataChunk.upscaleGasTypeCode,
        vendorId: dataChunk.vendorIdentifier,
        cylinderIdentifier: dataChunk.cylinderIdentifier,
        expirationDate: dataChunk.expirationDate,
        injectionProtocolCd: dataChunk.injectionProtocolCode,
      });
    }
  }

  async import(objectList: Array<object>): Promise<void> {
    if (objectList && objectList.length > 0) {
      const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
        'camdecmpswks.daily_calibration',
        [
          'cal_inj_id',
          'daily_test_sum_id',
          'online_offline_ind',
          'upscale_gas_level_cd',
          'zero_injection_date',
          'zero_injection_hour',
          'zero_injection_min',
          'upscale_injection_date',
          'upscale_injection_hour',
          'upscale_injection_min',
          'zero_measured_value',
          'upscale_measured_value',
          'zero_aps_ind',
          'upscale_aps_ind',
          'zero_cal_error',
          'upscale_cal_error',
          'zero_ref_value',
          'upscale_ref_value',
          'userid',
          'add_date',
          'update_date',
          'rpt_period_id',
          'upscale_gas_type_cd',
          'vendor_id',
          'cylinder_identifier',
          'expiration_date',
          'injection_protocol_cd',
        ],
        '|',
      );

      for (const slice of objectList) {
        bulkLoadStream.writeObject(slice);
      }

      bulkLoadStream.complete();
      await bulkLoadStream.finished;
    }
  }
}
