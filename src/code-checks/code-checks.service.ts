import { HttpStatus, Injectable } from "@nestjs/common";
import { Logger } from '@us-epa-camd/easey-common/logger';
import { EmissionsImportDTO } from "../dto/emissions.dto";
import { DailyEmissionImportDTO } from "../dto/daily-emission.dto";
import { isUndefinedOrNull } from "../utils/utils";
import { CodeFieldRepo, getErrorMessage, getInvalidCodes } from "./code-checks-utils";
import { WeeklyTestSummaryImportDTO } from "../dto/weekly-test-summary.dto";
import { SummaryValueImportDTO } from "../dto/summary-value.dto";
import { DailyTestSummaryImportDTO } from "../dto/daily-test-summary.dto";
import { HourlyOperatingImportDTO } from "../dto/hourly-operating.dto";
import { LongTermFuelFlowImportDTO } from "../dto/long-term-fuel-flow.dto";
import { SorbentTrapImportDTO } from "../dto/sorbent-trap.dto";
import { Nsps4tSummaryImportDTO } from "../dto/nsps4t-summary.dto";
import { EaseyException } from "@us-epa-camd/easey-common/exceptions/easey.exception";
import { getCodeFieldRepoList } from "./code-checks-utils";


@Injectable()
export class CodeChecksService {

    constructor(private readonly logger: Logger) {
        this.logger.setContext('CodeChecksService');
    }

    async runChecks(payload: EmissionsImportDTO): Promise<string[]> {
        this.logger.log('Running Code Checks');

        // NOTE: codesMap is not a class variable because providers are set to singleton scope so declaring codesMap as a class variable  will cause it to hold values for every request
        const codesMap = new Map<string, Set<string>>();
        const CODE_FIELD_REPO_LIST: CodeFieldRepo[] = getCodeFieldRepoList();

        const errorList = [];

        // Build up codesMap
        this.collectDailyEmissionsCodes(payload.dailyEmissionData, codesMap);
        this.collectWeeklyTestSummaryCodes(payload.weeklyTestSummaryData, codesMap);
        this.collectSummaryValueCodes(payload.summaryValueData, codesMap);
        this.collectDailyTestSummary(payload.dailyTestSummaryData, codesMap);
        this.collectHourlyOperatingData(payload.hourlyOperatingData, codesMap);
        this.collectLongTermFuelFlowData(payload.longTermFuelFlowData, codesMap);
        this.collectSorbentTrapData(payload.sorbentTrapData, codesMap);
        this.collectNsps4tSummary(payload.nsps4tSummaryData, codesMap);

        // Asynchronously make the DB queries
        const promises = [];
        CODE_FIELD_REPO_LIST.forEach(fr => promises.push( getInvalidCodes(codesMap.get(fr.codeField), fr.codeRepo) ))

        // resolve promises and push errors to array
        try{
            const results = await Promise.all(promises);
            results.forEach((result, idx) => {
                const errors = result.map(invalidCodeObj => getErrorMessage(CODE_FIELD_REPO_LIST[idx].codeField, invalidCodeObj.column1))
                errorList.push(...errors);
            })
        }catch (err) {
            throw new EaseyException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }

        return errorList;
    }

    collectDailyEmissionsCodes(payload: DailyEmissionImportDTO[], codesMap: Map<string, Set<string>>) {
        if (!payload)
            return;

        payload.forEach(dailyEm => {

            this.collectCode(dailyEm, "parameterCode", codesMap);

            dailyEm.dailyFuelData.forEach(dailyFuel => {
                this.collectCode(dailyFuel, "fuelCode", codesMap);
            })
        });
    }

    collectWeeklyTestSummaryCodes(payload: WeeklyTestSummaryImportDTO[], codesMap: Map<string, Set<string>>) {
        if (!payload)
            return;

        payload.forEach(wts => {
            this.collectCode(wts, "testTypeCode", codesMap);
            this.collectCode(wts, "testResultCode", codesMap);
            this.collectCode(wts, "spanScaleCode", codesMap);

            wts.weeklySystemIntegrityData.forEach(wsi => {
                this.collectCode(wsi, "gasLevelCode", codesMap);
            })
        })
    }

    collectSummaryValueCodes(payload: SummaryValueImportDTO[], codesMap: Map<string, Set<string>>) {
        if (!payload)
            return;

        payload.forEach(summaryVal => {
            this.collectCode(summaryVal, "parameterCode", codesMap);
        })
    }

    collectDailyTestSummary(payload: DailyTestSummaryImportDTO[], codesMap: Map<string, Set<string>>) {
        if (!payload)
            return;

        payload.forEach(dts => {
            this.collectCode(dts, "testTypeCode", codesMap);
            this.collectCode(dts, "testResultCode", codesMap);
            this.collectCode(dts, "spanScaleCode", codesMap);

            if (dts.dailyCalibrationData)
                dts.dailyCalibrationData.forEach(dailyCal => {
                    this.collectCode(dailyCal, "upscaleGasCode", codesMap);
                    this.collectCode(dailyCal, "injectionProtocolCode", codesMap);
                    this.collectCode(dailyCal, "vendorIdentifier", codesMap);
                })
        })
    }

    collectHourlyOperatingData(payload: HourlyOperatingImportDTO[], codesMap: Map<string, Set<string>>) {
        if (!payload)
            return;

        payload.forEach(hourlyOp => {
            this.collectCode(hourlyOp, "loadUnitsOfMeasureCode", codesMap);
            this.collectCode(hourlyOp, "fuelCode", codesMap);

            if (hourlyOp.monitorHourlyValueData)
                hourlyOp.monitorHourlyValueData.forEach(mhv => {
                    this.collectCode(mhv, "parameterCode", codesMap);
                    this.collectCode(mhv, "modcCode", codesMap);
                });

            if (hourlyOp.matsMonitorHourlyValueData)
                hourlyOp.matsMonitorHourlyValueData.forEach(mmhv => {
                    this.collectCode(mmhv, "parameterCode", codesMap);
                    this.collectCode(mmhv, "modcCode", codesMap);
                });

            if (hourlyOp.derivedHourlyValueData)
                hourlyOp.derivedHourlyValueData.forEach(dhv => {
                    this.collectCode(dhv, "parameterCode", codesMap);
                    this.collectCode(dhv, "modcCode", codesMap);
                    this.collectCode(dhv, "operatingConditionCode", codesMap);
                    this.collectCode(dhv, "fuelCode", codesMap);
                });

            if (hourlyOp.matsDerivedHourlyValueData)
                hourlyOp.matsDerivedHourlyValueData.forEach(mdhv => {
                    this.collectCode(mdhv, "parameterCode", codesMap);
                    this.collectCode(mdhv, "modcCode", codesMap);
                });

            if (hourlyOp.hourlyFuelFlowData)
                hourlyOp.hourlyFuelFlowData.forEach(hff => {
                    this.collectCode(hff, "fuelCode", codesMap);
                    this.collectCode(hff, "volumetricUnitsOfMeasureCode", codesMap);
                    this.collectCode(hff, "sourceOfDataVolumetricCode", codesMap);
                    this.collectCode(hff, "sourceOfDataMassCode", codesMap);

                    if (hff.hourlyParameterFuelFlowData)
                        hff.hourlyParameterFuelFlowData.forEach(hpff => {
                            this.collectCode(hpff, "parameterCode", codesMap);
                            this.collectCode(hpff, "sampleTypeCode", codesMap);
                            this.collectCode(hpff, "operatingConditionCode", codesMap);
                            this.collectCode(hpff, "parameterUnitsOfMeasureCode", codesMap);
                        });
                });

            if (hourlyOp.hourlyGFMData)
                hourlyOp.hourlyGFMData.forEach(hgfm => {
                    this.collectCode(hgfm, "beginEndHourFlag", codesMap);
                });
        })
    }

    collectLongTermFuelFlowData(payload: LongTermFuelFlowImportDTO[], codesMap: Map<string, Set<string>>) {
        if (!payload)
            return;

        payload.forEach(ltff => {
            this.collectCode(ltff, "fuelFlowPeriodCode", codesMap);
            this.collectCode(ltff, "longTermFuelFlowUnitsOfMeasureCode", codesMap);
            this.collectCode(ltff, "gcvUnitsOfMeasureCode", codesMap);
        });
    }

    collectSorbentTrapData(payload: SorbentTrapImportDTO[], codesMap: Map<string, Set<string>>) {
        if (!payload)
            return;

        payload.forEach(sorbentTrp => {
            this.collectCode(sorbentTrp, "modcCode", codesMap);
            this.collectCode(sorbentTrp, "apsCode", codesMap);

            if (sorbentTrp.samplingTrainData)
                sorbentTrp.samplingTrainData.forEach(st => {
                    this.collectCode(st, "samplingRatioCheckResultCode", codesMap);
                    this.collectCode(st, "postLeakCheckResultCode", codesMap);
                    this.collectCode(st, "trainQAStatusCode", codesMap);
                });
        });
    }

    collectNsps4tSummary(payload: Nsps4tSummaryImportDTO[], codesMap: Map<string, Set<string>>) {

        if (!payload)
            return;

        payload.forEach(nsps4t => {
            this.collectCode(nsps4t, "co2EmissionStandardCode", codesMap);
            this.collectCode(nsps4t, "modusUnitsOfMeasureCode", codesMap);
            this.collectCode(nsps4t, "electricalLoadCode", codesMap);

            if (nsps4t.nsps4tFourthQuarterData)
                nsps4t.nsps4tFourthQuarterData.forEach(nfq => {
                    this.collectCode(nfq, "annualEnergySoldTypeCode", codesMap);
                });

            if (nsps4t.nsps4tCompliancePeriodData)
                nsps4t.nsps4tCompliancePeriodData.forEach(ncp => {
                    this.collectCode(ncp, "co2EmissionRateUnitsOfMeasureCode", codesMap);
                });
        })
    }

    // Helper function to put the codeField such as "fuelCode" from the datum into the codesMap.
    collectCode(datum, codeField: string, codesMap: Map<string, Set<string>>) {
        if (isUndefinedOrNull(datum[codeField]))
            return;

        if (!codesMap.has(codeField))
            codesMap.set(codeField, new Set<string>());

        const codeSet: Set<string> = codesMap.get(codeField);
        codeSet.add(datum[codeField]);
    }

}

