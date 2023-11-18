import { HttpStatus, Injectable } from "@nestjs/common";
import { Logger } from '@us-epa-camd/easey-common/logger';
import { EmissionsImportDTO } from "../dto/emissions.dto";
import { DailyEmissionImportDTO } from "../dto/daily-emission.dto";
import { isUndefinedOrNull } from "../utils/utils";
import { getInvalidCodes } from "./code-checks-query";
import { ParameterCode } from "../entities/parameter-code.entity";
import { WeeklyTestSummaryImportDTO } from "../dto/weekly-test-summary.dto";
import { SummaryValueImportDTO } from "../dto/summary-value.dto";
import { DailyTestSummaryImportDTO } from "../dto/daily-test-summary.dto";
import { HourlyOperatingImportDTO } from "../dto/hourly-operating.dto";
import { LongTermFuelFlowImportDTO } from "../dto/long-term-fuel-flow.dto";
import { SorbentTrapImportDTO } from "../dto/sorbent-trap.dto";
import { Nsps4tSummaryImportDTO } from "../dto/nsps4t-summary.dto";
import { FuelCode } from "../entities/fuel-code.entity";
import { EaseyException } from "@us-epa-camd/easey-common/exceptions/easey.exception";
import { TestTypeCode } from "../entities/test-type-code.entity";
import { TestResultCode } from "../entities/test-result-code.entity";
import { SpanScaleCode } from "../entities/span-scale-code.entity";
import { GasLevelCode } from "../entities/gas-level-code.entity";
import { ProtocolGasVendor } from "../entities/protocol-gas-vendor.entity";
import { InjectionProtocolCode } from "../entities/injection-protocol-codes.entity";
import { UnitsOfMeasureCode } from "../entities/units-of-measure.entity";
import { ModcCode } from "../entities/modc-code.entity";
import { OperatingConditionCode } from "../entities/operating-condition-code.entity";
import { SodMassCode } from "../entities/sod-mass-code.entity";
import { SodVolumetricCode } from "../entities/sod-volumetri-code.entity";
import { SampleTypeCode } from "../entities/sample-type-code.entity";
import { BeginEndHourFlag } from "../entities/begin-end-hour-flag.entity";
import { FuelFlowPeriodCode } from "../entities/fuel-flow-period-code.entity";
import { ApsCode } from "../entities/aps-code.entity";
import { TrainQaStatusCode } from "../entities/train-qa-status-code.entity";
import { Nsps4tElectricalLoadCode } from "../entities/nsps4t-electrical-load-code.entity";
import { Nsps4tEmissionStandardCode } from "../entities/nsps4t-emission-standard-code.entity";

const getErrorMessage = (property, value) => `You reported an invalid ${property} of ${value}.`;
@Injectable()
export class CodeChecksService {


    constructor(private readonly logger: Logger) {
        this.logger.setContext('CodeChecksService');
    }


    async runChecks(payload: EmissionsImportDTO): Promise<string[]> {
        this.logger.log('Running Code Checks');
        // NOTE: codesMap is not a class variable because providers are set to singleton scope so declaring codesMap as a class variable  will cause it to hold values for every request
        const codesMap = new Map<string, Set<string>>();

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
        const invalidParameterCode = getInvalidCodes<ParameterCode>(codesMap.get("parameterCode"), ParameterCode.getRepository());
        const invalidFuelCodes = getInvalidCodes<FuelCode>(codesMap.get("fuelCode"), FuelCode.getRepository());
        const invalidTestTypeCodes = getInvalidCodes<TestTypeCode>(codesMap.get("testTypeCode"), TestTypeCode.getRepository());
        const invalidTestResultCodes = getInvalidCodes<TestResultCode>(codesMap.get("testResultCode"), TestResultCode.getRepository());
        const invalidSpanScaleCodes = getInvalidCodes<SpanScaleCode>(codesMap.get("spanScaleCode"), SpanScaleCode.getRepository());
        const invalidGasLevelCodes = getInvalidCodes<GasLevelCode>(codesMap.get("gasLevelCode"), GasLevelCode.getRepository());
        const invalidUpscaleGasLevelCodes = getInvalidCodes<GasLevelCode>(codesMap.get("upscaleGasCode"), GasLevelCode.getRepository());
        const invalidInjProtocolCodes = getInvalidCodes<InjectionProtocolCode>(codesMap.get("injectionProtocolCode"), InjectionProtocolCode.getRepository());
        const invalidVendors = getInvalidCodes<ProtocolGasVendor>(codesMap.get("vendorIdentifier"), ProtocolGasVendor.getRepository());
        const invalidLoadUomCodes = getInvalidCodes<UnitsOfMeasureCode>(codesMap.get("loadUnitsOfMeasureCode"), UnitsOfMeasureCode.getRepository());
        const invalidModcCodes = getInvalidCodes<ModcCode>(codesMap.get("modcCode"), ModcCode.getRepository());
        const invalidOpCondCodes = getInvalidCodes<OperatingConditionCode>(codesMap.get("operatingConditionCode"), OperatingConditionCode.getRepository());
        const invalidVolUomCodes = getInvalidCodes<UnitsOfMeasureCode>(codesMap.get("volumetricUnitsOfMeasureCode"), UnitsOfMeasureCode.getRepository());
        const invalidSodVolCodes = getInvalidCodes<SodVolumetricCode>(codesMap.get("sourceOfDataVolumetricCode"), SodVolumetricCode.getRepository());
        const invalidSodMassCodes = getInvalidCodes<SodMassCode>(codesMap.get("sourceOfDataMassCode"), SodMassCode.getRepository());
        const invalidSampleCodes = getInvalidCodes<SampleTypeCode>(codesMap.get("sampleTypeCode"), SampleTypeCode.getRepository());
        const invalidParamUomCodes = getInvalidCodes<UnitsOfMeasureCode>(codesMap.get("parameterUnitsOfMeasureCode"), UnitsOfMeasureCode.getRepository());
        const invalidHourFlags = getInvalidCodes<BeginEndHourFlag>(codesMap.get("beginEndHourFlag"), BeginEndHourFlag.getRepository());
        const invalidFuelFlowPeriodCodes = getInvalidCodes<FuelFlowPeriodCode>(codesMap.get("fuelFlowPeriodCode"), FuelFlowPeriodCode.getRepository());
        const invalidLtffUomCodes = getInvalidCodes<UnitsOfMeasureCode>(codesMap.get("longTermFuelFlowUnitsOfMeasureCode"), UnitsOfMeasureCode.getRepository());
        const invalidGcvUomCodes = getInvalidCodes<UnitsOfMeasureCode>(codesMap.get("gcvUnitsOfMeasureCode"), UnitsOfMeasureCode.getRepository());
        const invalidApsCodes = getInvalidCodes<ApsCode>(codesMap.get("apsCode"), ApsCode.getRepository());
        const invalidSrcResultCodes = getInvalidCodes<TestResultCode>(codesMap.get("samplingRatioCheckResultCode"), TestResultCode.getRepository());
        const invalidPlcResultCodes = getInvalidCodes<TestResultCode>(codesMap.get("postLeakCheckResultCode"), TestResultCode.getRepository());
        const invalidTrainQaStatusCodes = getInvalidCodes<TrainQaStatusCode>(codesMap.get("trainQAStatusCode"), TrainQaStatusCode.getRepository());
        const invalidCo2EmStdCodes = getInvalidCodes<Nsps4tEmissionStandardCode>(codesMap.get("co2EmissionStandardCode"), Nsps4tEmissionStandardCode.getRepository());
        const invalidModusUomCodes = getInvalidCodes<UnitsOfMeasureCode>(codesMap.get("modusUnitsOfMeasureCode"), UnitsOfMeasureCode.getRepository());
        const invalidElectricalLoadCodes = getInvalidCodes<Nsps4tElectricalLoadCode>(codesMap.get("electricalLoadCode"), Nsps4tElectricalLoadCode.getRepository());
        const invalidAnnualEnergySoldTypeCodes = getInvalidCodes<Nsps4tElectricalLoadCode>(codesMap.get("annualEnergySoldTypeCode"), Nsps4tElectricalLoadCode.getRepository());
        const invalidCo2RateUomCodes = getInvalidCodes<TrainQaStatusCode>(codesMap.get("co2EmissionRateUnitsOfMeasureCode"), TrainQaStatusCode.getRepository());

        try{
            const results = await Promise.all([invalidParameterCode, invalidFuelCodes, invalidTestTypeCodes, 
                                                invalidTestResultCodes, invalidSpanScaleCodes, invalidGasLevelCodes, invalidUpscaleGasLevelCodes, 
                                                invalidInjProtocolCodes, invalidVendors, invalidLoadUomCodes, invalidModcCodes, invalidOpCondCodes,
                                                invalidVolUomCodes, invalidSodVolCodes, invalidSodMassCodes, invalidSampleCodes, invalidParamUomCodes,
                                                invalidHourFlags, invalidFuelFlowPeriodCodes, invalidLtffUomCodes, invalidGcvUomCodes, invalidApsCodes,
                                                invalidSrcResultCodes, invalidPlcResultCodes, invalidTrainQaStatusCodes, invalidCo2EmStdCodes, 
                                                invalidModusUomCodes, invalidElectricalLoadCodes, invalidAnnualEnergySoldTypeCodes, invalidCo2RateUomCodes])
            
            // The results of the query come back with a list of invalid codes which are used to generate the error msgs                                    
            const parameterCodeErrors = results[0].map(invalidCodeObj => getErrorMessage("parameterCode", invalidCodeObj.column1))
            const fuelCodeErrors = results[1].map(invalidCodeObj => getErrorMessage("fuelCode", invalidCodeObj.column1))
            const testTypeCodeErrors = results[2].map(invalidCodeObj => getErrorMessage("testTypeCode", invalidCodeObj.column1))
            const testResultCodeErrors = results[3].map(invalidCodeObj => getErrorMessage("testResultCode", invalidCodeObj.column1))
            const spanScaleCodeErrors = results[4].map(invalidCodeObj => getErrorMessage("spanScaleCode", invalidCodeObj.column1))
            const gasLevelCodeErrors = results[5].map(invalidCodeObj => getErrorMessage("gasLevelCode", invalidCodeObj.column1))
            const upscaleGasCodeErrors = results[6].map(invalidCodeObj => getErrorMessage("upscaleGasCode", invalidCodeObj.column1))
            const injectionProtocolCodeErrors = results[7].map(invalidCodeObj => getErrorMessage("injectionProtocolCode", invalidCodeObj.column1))
            const vendorIdentifierErrors = results[8].map(invalidCodeObj => getErrorMessage("vendorIdentifier", invalidCodeObj.column1))
            const loadUnitsOfMeasureCodeErrors = results[9].map(invalidCodeObj => getErrorMessage("loadUnitsOfMeasureCode", invalidCodeObj.column1))
            const modcCodeErrors = results[10].map(invalidCodeObj => getErrorMessage("modcCode", invalidCodeObj.column1))
            const operatingConditionCodeErrors = results[11].map(invalidCodeObj => getErrorMessage("operatingConditionCode", invalidCodeObj.column1))
            const volumetricUnitsOfMeasureCodeErrors = results[12].map(invalidCodeObj => getErrorMessage("volumetricUnitsOfMeasureCode", invalidCodeObj.column1))
            const sourceOfDataVolumetricCodeErrors = results[13].map(invalidCodeObj => getErrorMessage("sourceOfDataVolumetricCode", invalidCodeObj.column1))
            const sourceOfDataMassCodeErrors = results[14].map(invalidCodeObj => getErrorMessage("sourceOfDataMassCode", invalidCodeObj.column1))
            const sampleTypeCodeErrors = results[15].map(invalidCodeObj => getErrorMessage("sampleTypeCode", invalidCodeObj.column1))
            const parameterUnitsOfMeasureCodeErrors = results[16].map(invalidCodeObj => getErrorMessage("parameterUnitsOfMeasureCode", invalidCodeObj.column1))
            const beginEndHourFlagErrors = results[17].map(invalidCodeObj => getErrorMessage("beginEndHourFlag", invalidCodeObj.column1))
            const fuelFlowPeriodCodeErrors = results[18].map(invalidCodeObj => getErrorMessage("fuelFlowPeriodCode", invalidCodeObj.column1))
            const longTermFuelFlowUnitsOfMeasureCodeErrors = results[19].map(invalidCodeObj => getErrorMessage("longTermFuelFlowUnitsOfMeasureCode", invalidCodeObj.column1))
            const gcvUnitsOfMeasureCodeErrors = results[20].map(invalidCodeObj => getErrorMessage("gcvUnitsOfMeasureCode", invalidCodeObj.column1))
            const apsCodeErrors = results[21].map(invalidCodeObj => getErrorMessage("apsCode", invalidCodeObj.column1))
            const samplingRatioCheckResultCodeErrors = results[22].map(invalidCodeObj => getErrorMessage("samplingRatioCheckResultCode", invalidCodeObj.column1))
            const postLeakCheckResultCodeErrors = results[23].map(invalidCodeObj => getErrorMessage("postLeakCheckResultCode", invalidCodeObj.column1))
            const trainQAStatusCodeErrors = results[24].map(invalidCodeObj => getErrorMessage("trainQAStatusCode", invalidCodeObj.column1))
            const co2EmissionStandardCodeErrors = results[25].map(invalidCodeObj => getErrorMessage("co2EmissionStandardCode", invalidCodeObj.column1))
            const modusUnitsOfMeasureCodeErrors = results[26].map(invalidCodeObj => getErrorMessage("modusUnitsOfMeasureCode", invalidCodeObj.column1))
            const electricalLoadCodeErrors = results[27].map(invalidCodeObj => getErrorMessage("electricalLoadCode", invalidCodeObj.column1))
            const annualEnergySoldTypeCodeErrors = results[28].map(invalidCodeObj => getErrorMessage("annualEnergySoldTypeCode", invalidCodeObj.column1))
            const co2EmissionRateUnitsOfMeasureCodeErrors = results[29].map(invalidCodeObj => getErrorMessage("co2EmissionRateUnitsOfMeasureCode", invalidCodeObj.column1))

            errorList.push(...parameterCodeErrors, ...fuelCodeErrors, ...testTypeCodeErrors, ...testResultCodeErrors, ...spanScaleCodeErrors, ...gasLevelCodeErrors,
                ...upscaleGasCodeErrors, ...injectionProtocolCodeErrors, ...vendorIdentifierErrors, ...loadUnitsOfMeasureCodeErrors, ...modcCodeErrors, 
                ...operatingConditionCodeErrors, ...volumetricUnitsOfMeasureCodeErrors, ...sourceOfDataVolumetricCodeErrors, ...sourceOfDataMassCodeErrors, 
                ...sampleTypeCodeErrors, ...parameterUnitsOfMeasureCodeErrors, ...beginEndHourFlagErrors, ...fuelFlowPeriodCodeErrors, ...longTermFuelFlowUnitsOfMeasureCodeErrors,
                 ...gcvUnitsOfMeasureCodeErrors, ...apsCodeErrors, ...samplingRatioCheckResultCodeErrors, ...postLeakCheckResultCodeErrors, ...trainQAStatusCodeErrors,
                 ...co2EmissionStandardCodeErrors, ...modusUnitsOfMeasureCodeErrors, ...electricalLoadCodeErrors, ...annualEnergySoldTypeCodeErrors, ...co2EmissionRateUnitsOfMeasureCodeErrors)
            
            return errorList;
    
        }catch(err){
            throw new EaseyException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    collectDailyEmissionsCodes(payload: DailyEmissionImportDTO[], codesMap: Map<string, Set<string>>) {
        payload.forEach(dailyEm => {

            this.collectCode(dailyEm, "parameterCode", codesMap);

            dailyEm.dailyFuelData.forEach(dailyFuel => {
                this.collectCode(dailyFuel, "fuelCode", codesMap);
            })
        });
    }

    collectWeeklyTestSummaryCodes(payload: WeeklyTestSummaryImportDTO[], codesMap: Map<string, Set<string>>) {
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
        payload.forEach(summaryVal => {
            this.collectCode(summaryVal, "parameterCode", codesMap);
        })
    }

    collectDailyTestSummary(payload: DailyTestSummaryImportDTO[], codesMap: Map<string, Set<string>>) {
        payload.forEach(dts => {
            this.collectCode(dts, "testTypeCode", codesMap);
            this.collectCode(dts, "testResultCode", codesMap);
            this.collectCode(dts, "spanScaleCode", codesMap);

            dts.dailyCalibrationData.forEach(dailyCal => {
                this.collectCode(dailyCal, "upscaleGasCode", codesMap);
                this.collectCode(dailyCal, "injectionProtocolCode", codesMap);
                this.collectCode(dailyCal, "vendorIdentifier", codesMap);
            })
        })
    }

    collectHourlyOperatingData(payload: HourlyOperatingImportDTO[], codesMap: Map<string, Set<string>>) {
        payload.forEach(hourlyOp => {
            this.collectCode(hourlyOp, "loadUnitsOfMeasureCode", codesMap);
            this.collectCode(hourlyOp, "fuelCode", codesMap);

            hourlyOp.monitorHourlyValueData.forEach(mhv => {
                this.collectCode(mhv, "parameterCode", codesMap);
                this.collectCode(mhv, "modcCode", codesMap);
            });

            hourlyOp.matsMonitorHourlyValueData.forEach(mmhv => {
                this.collectCode(mmhv, "parameterCode", codesMap);
                this.collectCode(mmhv, "modcCode", codesMap);
            });

            hourlyOp.derivedHourlyValueData.forEach(dhv => {
                this.collectCode(dhv, "parameterCode", codesMap);
                this.collectCode(dhv, "modcCode", codesMap);
                this.collectCode(dhv, "operatingConditionCode", codesMap);
                this.collectCode(dhv, "fuelCode", codesMap);
            });

            hourlyOp.matsDerivedHourlyValueData.forEach(mdhv => {
                this.collectCode(mdhv, "parameterCode", codesMap);
                this.collectCode(mdhv, "modcCode", codesMap);
            });

            hourlyOp.hourlyFuelFlowData.forEach(hff => {
                this.collectCode(hff, "fuelCode", codesMap);
                this.collectCode(hff, "volumetricUnitsOfMeasureCode", codesMap);
                this.collectCode(hff, "sourceOfDataVolumetricCode", codesMap);
                this.collectCode(hff, "sourceOfDataMassCode", codesMap);

                hff.hourlyParameterFuelFlowData.forEach(hpff => {
                    this.collectCode(hpff, "parameterCode", codesMap);
                    this.collectCode(hpff, "sampleTypeCode", codesMap);
                    this.collectCode(hpff, "operatingConditionCode", codesMap);
                    this.collectCode(hpff, "parameterUnitsOfMeasureCode", codesMap);
                });
            });

            hourlyOp.hourlyGFMData.forEach(hgfm => {
                this.collectCode(hgfm, "beginEndHourFlag", codesMap);
            });
        })
    }

    collectLongTermFuelFlowData(payload: LongTermFuelFlowImportDTO[], codesMap: Map<string, Set<string>>){
        payload.forEach(ltff=>{
            this.collectCode(ltff, "fuelFlowPeriodCode", codesMap);
            this.collectCode(ltff, "longTermFuelFlowUnitsOfMeasureCode", codesMap);
            this.collectCode(ltff, "gcvUnitsOfMeasureCode", codesMap);
        });
    }

    collectSorbentTrapData(payload: SorbentTrapImportDTO[], codesMap: Map<string, Set<string>>){
        payload.forEach(sorbentTrp =>{
            this.collectCode(sorbentTrp, "modcCode", codesMap);
            this.collectCode(sorbentTrp, "apsCode", codesMap);

            sorbentTrp.samplingTrainData.forEach(st => {
                this.collectCode(st, "samplingRatioCheckResultCode", codesMap);
                this.collectCode(st, "postLeakCheckResultCode", codesMap);
                this.collectCode(st, "trainQAStatusCode", codesMap);
            });
        });
    }

    collectNsps4tSummary(payload: Nsps4tSummaryImportDTO[], codesMap: Map<string, Set<string>>){
        payload.forEach(nsps4t =>{
            this.collectCode(nsps4t, "co2EmissionStandardCode", codesMap);
            this.collectCode(nsps4t, "modusUnitsOfMeasureCode", codesMap);
            this.collectCode(nsps4t, "electricalLoadCode", codesMap);

            nsps4t.nsps4tFourthQuarterData.forEach(nfq => {
                this.collectCode(nfq, "annualEnergySoldTypeCode", codesMap);
            });

            nsps4t.nsps4tCompliancePeriodData.forEach( ncp => {
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

