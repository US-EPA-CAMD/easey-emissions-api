export class DailyCalibrationBaseDTO {
  onLineOffLineIndicator?: number;

  upscaleGasCode?: string;

  zeroInjectionDate?: Date;

  zeroInjectionHour?: number;

  zeroInjectionMinute?: number;

  upscaleInjectionDate?: Date;

  upscaleInjectionHour?: number;

  upscaleInjectionMinute?: number;

  zeroMeasuredValue?: number;

  upscaleMeasuredValue?: number;

  zeroAPSIndicator?: number;

  upscaleAPSIndicator?: number;

  zeroCalibrationError?: number;

  upscaleCalibrationError?: number;

  zeroReferenceValue?: number;

  upscaleReferenceValue?: number;

  upscaleGasTypeCode?: string;

  cylinderIdentifier?: string;

  vendorIdentifier?: string;

  expirationDate?: Date;

  injectionProtocolCode?: string;
}

export class DailyCalibrationRecordDTO extends DailyCalibrationBaseDTO {
  id: string;

  dailyTestSumId: string;

  calcOnlineOfflineIndicator?: number;

  calcZeroApsIndicator?: number;

  calcUpscaleApsIndicator?: number;

  calcZeroCalibrationError?: number;

  calcUpscaleCalibrationError?: number;

  userId?: string;

  addDate?: Date;

  updateDate?: Date;

  reportingPeriodId?: number;
}

export class DailyCalibrationImportDTO extends DailyCalibrationBaseDTO {}

export class DailyCalibrationDTO extends DailyCalibrationRecordDTO {}
