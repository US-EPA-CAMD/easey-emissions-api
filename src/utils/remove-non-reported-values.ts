import { EmissionsDTO } from "../dto/emissions.dto";
import { DailyTestSummaryDTO } from "../dto/daily-test-summary.dto";
import { DailyCalibrationDTO } from "../dto/daily-calibration.dto";
import { HourlyOperatingDTO } from "../dto/hourly-operating.dto";
import { MatsMonitorHourlyValueDTO } from "../dto/mats-monitor-hourly-value.dto";
import { DerivedHourlyValueDTO } from "../dto/derived-hourly-value.dto";
import { MatsDerivedHourlyValueDTO } from "../dto/mats-derived-hourly-value.dto";
import { HourlyFuelFlowDTO } from "../dto/hourly-fuel-flow.dto";
import { HourlyParamFuelFlowDTO } from "../dto/hourly-param-fuel-flow.dto";
import { HourlyGasFlowMeterDTO } from "../dto/hourly-gas-flow-meter.dto";
import { MonitorHourlyValueDTO } from "../dto/monitor-hourly-value.dto";
import { DailyEmissionDTO } from "../dto/daily-emission.dto";
import { DailyFuelDTO } from "../dto/daily-fuel.dto";
import { SorbentTrapDTO } from "../dto/sorbent-trap.dto";
import { SamplingTrainDTO } from "../dto/sampling-train.dto";
import { WeeklyTestSummaryDTO } from "../dto/weekly-test-summary.dto";
import { WeeklySystemIntegrityDTO } from "../dto/weekly-system-integrity.dto";
import { SummaryValueDTO } from "../dto/summary-value.dto";
import { Nsps4tSummaryDTO } from "../dto/nsps4t-summary.dto";
import { Nsps4tAnnualDTO } from "../dto/nsps4t-annual.dto";
import { Nsps4tCompliancePeriodDTO } from "../dto/nsps4t-compliance-period.dto";
import { LongTermFuelFlowDTO } from "../dto/long-term-fuel-flow.dto";
import { DailyBackstopDTO } from "src/dto/daily-backstop.dto";

export async function removeNonReportedValues(dto: EmissionsDTO) {
  const promises = [];
  promises.push(removeDailyTestSummaryNonReportedValues(dto.dailyTestSummaryData));
  promises.push(removeHourlyOperatingNonReportedValues(dto.hourlyOperatingData));
  promises.push(removeDailyEmissionsNonReportedValues(dto.dailyEmissionData));
  promises.push(removeSorbentTrapNonReportedValues(dto.sorbentTrapData));
  promises.push(removeWeeklyTestSummaryNonReportedValues(dto.weeklyTestSummaryData));
  promises.push(removeSummaryValueNonReportedValues(dto.summaryValueData));
  promises.push(removeNSPS4TSummaryNonReportedValues(dto.nsps4tSummaryData));
  promises.push(removeLongTermFuelFlowNonReportedValues(dto.longTermFuelFlowData));
  promises.push(removeDailyBackstopEmissionsNonReportedValues(dto.dailyBackstopData))

  delete dto.monitorPlanId;
  delete dto.reportingPeriodId;
  delete dto.lastUpdated;
  delete dto.updatedStatusFlg;
  delete dto.needsEvalFlag;
  delete dto.chkSessionId;
  delete dto.submissionId;
  delete dto.submissionAvailabilityCd;

  await Promise.all(promises);
}

async function removeDailyTestSummaryNonReportedValues(dailyTestSummaryData: DailyTestSummaryDTO[]) {
  const promises = [];
  dailyTestSummaryData.forEach(dto => {
    promises.push(removeDailyCalibrationNonReportedValues(dto.dailyCalibrationData));
    delete dto.id;
    delete dto.monitoringLocationId;
    delete dto.reportingPeriodId;
    delete dto.monitoringSystemRecordId;
    delete dto.componentRecordId;
    delete dto.calcTestResultCode;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });

  await Promise.all(promises);
}

async function removeDailyCalibrationNonReportedValues(dailyCalibrationData: DailyCalibrationDTO[]) {
  dailyCalibrationData.forEach(dto => {
    delete dto.id;
    delete dto.dailyTestSumId;
    delete dto.reportingPeriodId;
    delete dto.calcOnlineOfflineIndicator;
    delete dto.calcZeroApsIndicator;
    delete dto.calcUpscaleApsIndicator;
    delete dto.calcZeroCalibrationError;
    delete dto.calcUpscaleCalibrationError;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  })
}

async function removeHourlyOperatingNonReportedValues(hourlyOperatingData: HourlyOperatingDTO[]) {
  const promises = [];
  hourlyOperatingData.forEach(dto => {
    promises.push(removeMonitorHourlyValueNonReportedValues(dto.monitorHourlyValueData));
    promises.push(removeMatsMonitorHourlyValueNonReportedValues(dto.matsMonitorHourlyValueData));
    promises.push(removeDerivedHourlyValueNonReportedValues(dto.derivedHourlyValueData));
    promises.push(removeMatsDerivedHourlyValueNonReportedValues(dto.matsDerivedHourlyValueData));
    promises.push(removeHourlyFuelFlowNonReportedValues(dto.hourlyFuelFlowData));
    promises.push(removeHourlyGFMNonReportedValues(dto.hourlyGFMData));
    delete dto.id;
    delete dto.monitoringLocationId;
    delete dto.reportingPeriodId;
    delete dto.multiFuelFlg;
    delete dto.fuelCdList;
    delete dto.mhhiIndicator;
    delete dto.operatingConditionCode;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });

  await Promise.all(promises);
}

async function removeMonitorHourlyValueNonReportedValues(monitorHourlyValueData: MonitorHourlyValueDTO[]) {
  monitorHourlyValueData.forEach(dto => {
    delete dto.id;
    delete dto.hourId;
    delete dto.reportingPeriodId;
    delete dto.monitoringLocationId;
    delete dto.monitoringSystemRecordId;
    delete dto.componentRecordId;
    delete dto.biasAdjustmentFactor;
    delete dto.calcAdjustedHrlyValue;
    delete dto.calcLineStatus;
    delete dto.calcRataStatus;
    delete dto.calcDaycalStatus;
    delete dto.calcLeakStatus;
    delete dto.calcDayintStatus;
    delete dto.calcF2lStatus;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  })
}

async function removeMatsMonitorHourlyValueNonReportedValues(matsMonitorHourlyValueData: MatsMonitorHourlyValueDTO[]) {
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

async function removeDerivedHourlyValueNonReportedValues(derivedHourlyValueData: DerivedHourlyValueDTO[]) {
  derivedHourlyValueData.forEach(dto => {
    delete dto.id;
    delete dto.hourId;
    delete dto.reportingPeriodId;
    delete dto.monitoringLocationId;
    delete dto.monitoringSystemRecordId;
    delete dto.monitoringFormulaRecordId;
    delete dto.biasAdjustmentFactor;
    delete dto.calcAdjustedHrlyValue;
    delete dto.diluentCapInd;
    delete dto.calcPctDiluent;
    delete dto.calcPctMoisture;
    delete dto.calcAppeStatus;
    delete dto.calcFuelFlowTotal;
    delete dto.calcHourMeasureCode;
    delete dto.calcUnadjustedHrlyValue;
    delete dto.calcRataStatus;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  })
}

async function removeMatsDerivedHourlyValueNonReportedValues(matsDerivedHourlyValueData: MatsDerivedHourlyValueDTO[]) {
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

async function removeHourlyFuelFlowNonReportedValues(hourlyFuelFlowData: HourlyFuelFlowDTO[]) {
  const promises = [];
  hourlyFuelFlowData.forEach(dto => {
    promises.push(removeHourlyParameterFuelFlowNonReportedValues(dto.hourlyParameterFuelFlowData));
    delete dto.id;
    delete dto.hourId;
    delete dto.monitoringLocationId;
    delete dto.reportingPeriodId;
    delete dto.monitoringSystemRecordId;
    delete dto.calcMassFlowRate;
    delete dto.calcVolumetricFlowRate;
    delete dto.calcAppdStatus;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });

  await Promise.all(promises);
}

async function removeHourlyParameterFuelFlowNonReportedValues(hourlyParameterFuelFlowData: HourlyParamFuelFlowDTO[]) {
  hourlyParameterFuelFlowData.forEach(dto => {
    delete dto.id;
    delete dto.hourlyFuelFlowId;
    delete dto.reportingPeriodId;
    delete dto.monitoringLocationId;
    delete dto.monitoringFormulaRecordId;
    delete dto.calcParamValFuel;
    delete dto.calcAppeStatus;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  })
}

async function removeHourlyGFMNonReportedValues(hourlyGFMData: HourlyGasFlowMeterDTO[]) {
  hourlyGFMData.forEach(dto => {
    delete dto.id;
    delete dto.hourId;
    delete dto.reportingPeriodId;
    delete dto.monitoringLocationId;
    delete dto.componentRecordId;
    delete dto.calcFlowToSamplingRatio;
    delete dto.calcFlowToSamplingMult;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  })
}

async function removeDailyEmissionsNonReportedValues(dailyEmissionData: DailyEmissionDTO[]) {
  const promises = [];
  dailyEmissionData.forEach(dto => {
    promises.push(removeDailyFuelNonReportedValues(dto.dailyFuelData));
    delete dto.id;
    delete dto.monitoringLocationId;
    delete dto.reportingPeriodId;
    delete dto.calcTotalDailyEmissions;
    delete dto.calcTotalOpTime;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });

  await Promise.all(promises);
}

async function removeDailyBackstopEmissionsNonReportedValues(dailyBackstopData: DailyBackstopDTO[]) {
  dailyBackstopData.forEach(dto => {
    delete dto.id;
    delete dto.monitoringLocationId;
    delete dto.reportingPeriodId;
    delete dto.userId;
    delete dto.updateDate;
  });
}

async function removeDailyFuelNonReportedValues(dailyFuelData: DailyFuelDTO[]) {
  dailyFuelData.forEach(dto => {
    delete dto.id;
    delete dto.dailyEmissionId;
    delete dto.reportingPeriodId;
    delete dto.calcFuelCarbonBurned;
    delete dto.monitoringLocationId;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  })
}

async function removeSorbentTrapNonReportedValues(sorbentTrapData: SorbentTrapDTO[]) {
  const promises = [];
  sorbentTrapData.forEach(dto => {
    promises.push(removeSamplingTrainNonReportedValues(dto.samplingTrainData));
    delete dto.id;
    delete dto.monitoringLocationId;
    delete dto.reportingPeriodId;
    delete dto.monitoringSystemRecordId;
    delete dto.calcPairedTrapAgreement;
    delete dto.calcModcCode;
    delete dto.calcHgConcentration;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });

  await Promise.all(promises);
}

async function removeSamplingTrainNonReportedValues(samplingTrainData: SamplingTrainDTO[]) {
  samplingTrainData.forEach(dto => {
    delete dto.id;
    delete dto.sorbentTrapId;
    delete dto.reportingPeriodId;
    delete dto.componentRecordId;
    delete dto.monitoringLocationId;
    delete dto.calcHgConcentration;
    delete dto.calcPercentBreakthrough;
    delete dto.calcPercentSpikeRecovery;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  })
}

async function removeWeeklyTestSummaryNonReportedValues(weeklyTestSummaryData: WeeklyTestSummaryDTO[]) {
  const promises = [];
  weeklyTestSummaryData.forEach(dto => {
    promises.push(removeWeeklySystemIntegrityNonReportedValues(dto.weeklySystemIntegrityData));
    delete dto.id;
    delete dto.monitoringLocationId;
    delete dto.reportingPeriodId;
    delete dto.monitoringSystemRecordId;
    delete dto.componentRecordId;
    delete dto.calcTestResultCode;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });

  await Promise.all(promises);
}

async function removeWeeklySystemIntegrityNonReportedValues(weeklySystemIntegrityData: WeeklySystemIntegrityDTO[]) {
  weeklySystemIntegrityData.forEach(dto => {
    delete dto.id;
    delete dto.weeklyTestSumId;
    delete dto.reportingPeriodId;
    delete dto.monitoringLocationId;
    delete dto.calcSystemIntegrityError;
    delete dto.calcApsInd;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  })
}

async function removeSummaryValueNonReportedValues(summaryValueData: SummaryValueDTO[]) {
  summaryValueData.forEach(dto => {
    delete dto.id;
    delete dto.monitoringLocationId;
    delete dto.reportingPeriodId;
    delete dto.calcCurrentRptPeriodTotal;
    delete dto.calcOsTotal;
    delete dto.calcYearTotal;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  })
}

async function removeNSPS4TSummaryNonReportedValues(nsps4tSummaryData: Nsps4tSummaryDTO[]) {
  const promises = [];
  nsps4tSummaryData.forEach(dto => {
    promises.push(removeNSPS4TFourthQuarterNonReportedValues(dto.nsps4tFourthQuarterData));
    promises.push(removeNSPS4TCompliancePeriodNonReportedValues(dto.nsps4tCompliancePeriodData));
    delete dto.id;
    delete dto.monitoringLocationId;
    delete dto.reportingPeriodId;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });

  await Promise.all(promises);
}

async function removeNSPS4TFourthQuarterNonReportedValues(nsps4tFourthQuarterData: Nsps4tAnnualDTO[]) {
  nsps4tFourthQuarterData.forEach(dto => {
    delete dto.id;
    delete dto.nsps4tSumId;
    delete dto.reportingPeriodId;
    delete dto.monitoringLocationId;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  })
}

async function removeNSPS4TCompliancePeriodNonReportedValues(nsps4tCompliancePeriodData: Nsps4tCompliancePeriodDTO[]) {
  nsps4tCompliancePeriodData.forEach(dto => {
    delete dto.id;
    delete dto.nsps4tSumId;
    delete dto.reportingPeriodId;
    delete dto.monitoringLocationId;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  })
}

async function removeLongTermFuelFlowNonReportedValues(longTermFuelFlowData: LongTermFuelFlowDTO[]) {
  longTermFuelFlowData.forEach(dto => {
    delete dto.id;
    delete dto.monitoringLocationId;
    delete dto.reportingPeriodId;
    delete dto.monitoringSystemRecordId;
    delete dto.calcTotalHeatInput;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  })
}