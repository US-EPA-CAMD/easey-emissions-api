import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { DailyCalibrationDTO } from '../dto/daily-calibration.dto';
import { DailyCalibration } from '../entities/daily-calibration.entity';

@Injectable()
export class DailyCalibrationMap extends BaseMap<DailyCalibration, DailyCalibrationDTO> {

  public async one(entity: DailyCalibration): Promise<DailyCalibrationDTO> {

    return {
      id: entity.id,
      dailyTestSumId: entity.dailyTestSummaryId,
      rptPeriodId: entity.reportingPeriodId,
      onLineOffLineIndicator: null,//entity.onLineOffLineIndicator,
      calcOnlineOfflineIndicator: entity.calcOnlineOfflineIndicator,
      upscaleGasCode: entity.upscaleGasCode,
      zeroInjectionDate: entity.zeroInjectionDate,
      zeroInjectionHour: entity.zeroInjectionHour,
      zeroInjectionMinute: entity.zeroInjectionMinute,
      upscaleInjectionDate: entity.upscaleInjectionDate,
      upscaleInjectionHour: entity.upscaleInjectionHour,
      upscaleInjectionMinute: entity.upscaleInjectionMinute,
      zeroMeasuredValue: entity.zeroMeasuredValue,
      upscaleMeasuredValue: entity.upscaleMeasuredValue,
      zeroAPSIndicator: null,//entity.zeroApsIndicator,
      calcZeroApsIndicator: entity.calcZeroApsIndicator,
      upscaleAPSIndicator: null,//entity.upscaleApsIndicator,
      calcUpscaleApsIndicator: entity.calcUpscaleApsIndicator,
      zeroCalibrationError: entity.zeroCalibrationError,
      calcZeroCalibrationError: entity.calcZeroCalibrationError,
      upscaleCalibrationError: entity.upscaleCalibrationError,
      calcUpscaleCalibrationError: entity.calcUpscaleCalibrationError,
      zeroReferenceValue: entity.zeroReferenceValue,
      upscaleReferenceValue: entity.upscaleReferenceValue,
      upscaleGasTypeCode: entity.upscaleGasTypeCode,
      cylinderIdentifier: entity.cylinderIdentifier,
      vendorIdentifier: entity.vendorIdentifier,
      expirationDate: entity.expirationDate,
      injectionProtocolCode: entity.injectionProtocolCode,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
    };
  }
}
