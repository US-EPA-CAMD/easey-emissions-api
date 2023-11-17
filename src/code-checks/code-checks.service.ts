import { HttpStatus, Injectable } from "@nestjs/common";
import { Logger } from '@us-epa-camd/easey-common/logger';
import { EmissionsImportDTO } from "../dto/emissions.dto";
import { DailyEmissionImportDTO } from "../dto/daily-emission.dto";
import { getCodeMap } from "./code-map-generator";
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

@Injectable()
export class CodeChecksService {

    codesMap: Map<string, Set<string>>;

    constructor(private readonly logger: Logger) {
        this.logger.setContext('CodeChecksService');
        this.codesMap = new Map<string, Set<string>>();
    }


    async runChecks(payload: EmissionsImportDTO): Promise<string[]> {
        this.logger.log('Running Code Checks');

        const errorList = [];

        // Build up codesMap
        this.collectDailyEmissionsCodes(payload.dailyEmissionData);
        this.collectWeeklyTestSummaryCodes(payload.weeklyTestSummaryData);
        this.collectSummaryValueCodes(payload.summaryValueData);
        this.collectDailyTestSummary(payload.dailyTestSummaryData);
        this.collectHourlyOperatingData(payload.hourlyOperatingData);
        this.collectLongTermFuelFlowData(payload.longTermFuelFlowData);
        this.collectSorbentTrapData(payload.sorbentTrapData);
        this.collectNsps4tSummary(payload.nsps4tSummaryData);

        console.log('this.codesMap')
        this.codesMap.forEach((value, key)=>{
            console.log(`m[${key}] = ${Array.from(value)}`);
        })

        // Asynchronously make the DB queries
        const invalidParameterCode = getInvalidCodes<ParameterCode>(this.codesMap.get("parameterCode"), ParameterCode.getRepository());
        const invalidFuelCodes = getInvalidCodes<FuelCode>(this.codesMap.get("fuelCode"), FuelCode.getRepository());
        const invalidTestTypeCodes = getInvalidCodes<TestTypeCode>(this.codesMap.get("testTypeCode"), TestTypeCode.getRepository());
        const invalidTestResultCodes = getInvalidCodes<TestResultCode>(this.codesMap.get("testResultCode"), TestResultCode.getRepository());
        const invalidSpanScaleCodes = getInvalidCodes<SpanScaleCode>(this.codesMap.get("spanScaleCode"), SpanScaleCode.getRepository());
        const invalidGasLevelCodes = getInvalidCodes<GasLevelCode>(this.codesMap.get("gasLevelCode"), GasLevelCode.getRepository());
        const invalidUpscaleGasLevelCodes = getInvalidCodes<GasLevelCode>(this.codesMap.get("upscaleGasCode"), GasLevelCode.getRepository());
        const invalidInjProtocolCodes = getInvalidCodes<InjectionProtocolCode>(this.codesMap.get("injectionProtocolCode"), InjectionProtocolCode.getRepository());
        const invalidVendors = getInvalidCodes<ProtocolGasVendor>(this.codesMap.get("vendorIdentifier"), ProtocolGasVendor.getRepository());
        const invalidLoadUomCodes = getInvalidCodes<UnitsOfMeasureCode>(this.codesMap.get("loadUnitsOfMeasureCode"), UnitsOfMeasureCode.getRepository());
        const invalidModcCodes = getInvalidCodes<ModcCode>(this.codesMap.get("modcCode"), ModcCode.getRepository());
        const invalidOpCondCodes = getInvalidCodes<OperatingConditionCode>(this.codesMap.get("operatingConditionCode"), OperatingConditionCode.getRepository());
        const invalidVolUomCodes = getInvalidCodes<UnitsOfMeasureCode>(this.codesMap.get("volumetricUnitsOfMeasureCode"), UnitsOfMeasureCode.getRepository());
        const invalidSodVolCodes = getInvalidCodes<SodVolumetricCode>(this.codesMap.get("sourceOfDataVolumetricCode"), SodVolumetricCode.getRepository());
        const invalidSodMassCodes = getInvalidCodes<SodMassCode>(this.codesMap.get("sourceOfDataMassCode"), SodMassCode.getRepository());
        const invalidSampleCodes = getInvalidCodes<SampleTypeCode>(this.codesMap.get("sampleTypeCode"), SampleTypeCode.getRepository());
        const invalidParamUomCodes = getInvalidCodes<UnitsOfMeasureCode>(this.codesMap.get("parameterUnitsOfMeasureCode"), UnitsOfMeasureCode.getRepository());
        const invalidHourFlags = getInvalidCodes<BeginEndHourFlag>(this.codesMap.get("beginEndHourFlag"), BeginEndHourFlag.getRepository());
        const invalidFuelFlowPeriodCodes = getInvalidCodes<FuelFlowPeriodCode>(this.codesMap.get("fuelFlowPeriodCode"), FuelFlowPeriodCode.getRepository());
        const invalidLtffUomCodes = getInvalidCodes<UnitsOfMeasureCode>(this.codesMap.get("longTermFuelFlowUnitsOfMeasureCode"), UnitsOfMeasureCode.getRepository());
        const invalidGcvUomCodes = getInvalidCodes<UnitsOfMeasureCode>(this.codesMap.get("gcvUnitsOfMeasureCode"), UnitsOfMeasureCode.getRepository());
        const invalidApsCodes = getInvalidCodes<ApsCode>(this.codesMap.get("apsCode"), ApsCode.getRepository());
        const invalidSrcResultCodes = getInvalidCodes<TestResultCode>(this.codesMap.get("samplingRatioCheckResultCode"), TestResultCode.getRepository());
        const invalidPlcResultCodes = getInvalidCodes<TestResultCode>(this.codesMap.get("postLeakCheckResultCode"), TestResultCode.getRepository());
        const invalidTrainQaStatusCodes = getInvalidCodes<TrainQaStatusCode>(this.codesMap.get("trainQAStatusCode"), TrainQaStatusCode.getRepository());
        const invalidCo2EmStdCodes = getInvalidCodes<Nsps4tEmissionStandardCode>(this.codesMap.get("co2EmissionStandardCode"), Nsps4tEmissionStandardCode.getRepository());
        const invalidModusUomCodes = getInvalidCodes<UnitsOfMeasureCode>(this.codesMap.get("modusUnitsOfMeasureCode"), UnitsOfMeasureCode.getRepository());
        const invalidElectricalLoadCodes = getInvalidCodes<Nsps4tElectricalLoadCode>(this.codesMap.get("electricalLoadCode"), Nsps4tElectricalLoadCode.getRepository());
        const invalidAnnualEnergySoldTypeCodes = getInvalidCodes<Nsps4tElectricalLoadCode>(this.codesMap.get("annualEnergySoldTypeCode"), Nsps4tElectricalLoadCode.getRepository());
        const invalidCo2RateUomCodes = getInvalidCodes<TrainQaStatusCode>(this.codesMap.get("co2EmissionRateUnitsOfMeasureCode"), TrainQaStatusCode.getRepository());

        try{
            const results = await Promise.all([invalidParameterCode, invalidFuelCodes, invalidTestTypeCodes, 
                                                invalidTestResultCodes, invalidSpanScaleCodes, invalidGasLevelCodes, invalidUpscaleGasLevelCodes, 
                                                invalidInjProtocolCodes, invalidVendors, invalidLoadUomCodes, invalidModcCodes, invalidOpCondCodes,
                                                invalidVolUomCodes, invalidSodVolCodes, invalidSodMassCodes, invalidSampleCodes, invalidParamUomCodes,
                                                invalidHourFlags, invalidFuelFlowPeriodCodes, invalidLtffUomCodes, invalidGcvUomCodes, invalidApsCodes,
                                                invalidSrcResultCodes, invalidPlcResultCodes, invalidTrainQaStatusCodes, invalidCo2EmStdCodes, 
                                                invalidModusUomCodes, invalidElectricalLoadCodes, invalidAnnualEnergySoldTypeCodes, invalidCo2RateUomCodes])

            const parameterCodeErrors = results[0].map(invalidCodeObj => `You reported an invalid parameterCode of ${invalidCodeObj.column1}.`)
            const fuelCodeErrors = results[1].map(invalidCodeObj => `You reported an invalid fuelCode of ${invalidCodeObj.column1}.`)
            const testTypeCodeErrors = results[2].map(invalidCodeObj => `You reported an invalid testTypeCode of ${invalidCodeObj.column1}.`)
            const testResultCodeErrors = results[3].map(invalidCodeObj => `You reported an invalid testResultCode of ${invalidCodeObj.column1}.`)
            const spanScaleCodeErrors = results[4].map(invalidCodeObj => `You reported an invalid spanScaleCode of ${invalidCodeObj.column1}.`)
            const gasLevelCodeErrors = results[5].map(invalidCodeObj => `You reported an invalid gasLevelCode of ${invalidCodeObj.column1}.`)
            const upscaleGasCodeErrors = results[6].map(invalidCodeObj => `You reported an invalid upscaleGasCode of ${invalidCodeObj.column1}.`)
            const injectionProtocolCodeErrors = results[7].map(invalidCodeObj => `You reported an invalid injectionProtocolCode of ${invalidCodeObj.column1}.`)
            const vendorIdentifierErrors = results[8].map(invalidCodeObj => `You reported an invalid vendorIdentifier of ${invalidCodeObj.column1}.`)
            const loadUnitsOfMeasureCodeErrors = results[9].map(invalidCodeObj => `You reported an invalid loadUnitsOfMeasureCode of ${invalidCodeObj.column1}.`)
            const modcCodeErrors = results[10].map(invalidCodeObj => `You reported an invalid modcCode of ${invalidCodeObj.column1}.`)
            const operatingConditionCodeErrors = results[11].map(invalidCodeObj => `You reported an invalid operatingConditionCode of ${invalidCodeObj.column1}.`)
            const volumetricUnitsOfMeasureCodeErrors = results[12].map(invalidCodeObj => `You reported an invalid volumetricUnitsOfMeasureCode of ${invalidCodeObj.column1}.`)
            const sourceOfDataVolumetricCodeErrors = results[13].map(invalidCodeObj => `You reported an invalid sourceOfDataVolumetricCode of ${invalidCodeObj.column1}.`)
            const sourceOfDataMassCodeErrors = results[14].map(invalidCodeObj => `You reported an invalid sourceOfDataMassCode of ${invalidCodeObj.column1}.`)
            const sampleTypeCodeErrors = results[15].map(invalidCodeObj => `You reported an invalid sampleTypeCode of ${invalidCodeObj.column1}.`)
            const parameterUnitsOfMeasureCodeErrors = results[16].map(invalidCodeObj => `You reported an invalid parameterUnitsOfMeasureCode of ${invalidCodeObj.column1}.`)
            const beginEndHourFlagErrors = results[17].map(invalidCodeObj => `You reported an invalid beginEndHourFlag of ${invalidCodeObj.column1}.`)
            const fuelFlowPeriodCodeErrors = results[18].map(invalidCodeObj => `You reported an invalid fuelFlowPeriodCode of ${invalidCodeObj.column1}.`)
            const longTermFuelFlowUnitsOfMeasureCodeErrors = results[19].map(invalidCodeObj => `You reported an invalid longTermFuelFlowUnitsOfMeasureCode of ${invalidCodeObj.column1}.`)
            const gcvUnitsOfMeasureCodeErrors = results[20].map(invalidCodeObj => `You reported an invalid gcvUnitsOfMeasureCode of ${invalidCodeObj.column1}.`)
            const apsCodeErrors = results[21].map(invalidCodeObj => `You reported an invalid apsCode of ${invalidCodeObj.column1}.`)
            const samplingRatioCheckResultCodeErrors = results[22].map(invalidCodeObj => `You reported an invalid samplingRatioCheckResultCode of ${invalidCodeObj.column1}.`)
            const postLeakCheckResultCodeErrors = results[23].map(invalidCodeObj => `You reported an invalid postLeakCheckResultCode of ${invalidCodeObj.column1}.`)
            const trainQAStatusCodeErrors = results[24].map(invalidCodeObj => `You reported an invalid trainQAStatusCode of ${invalidCodeObj.column1}.`)
            const co2EmissionStandardCodeErrors = results[25].map(invalidCodeObj => `You reported an invalid co2EmissionStandardCode of ${invalidCodeObj.column1}.`)
            const modusUnitsOfMeasureCodeErrors = results[26].map(invalidCodeObj => `You reported an invalid modusUnitsOfMeasureCode of ${invalidCodeObj.column1}.`)
            const electricalLoadCodeErrors = results[27].map(invalidCodeObj => `You reported an invalid electricalLoadCode of ${invalidCodeObj.column1}.`)
            const annualEnergySoldTypeCodeErrors = results[28].map(invalidCodeObj => `You reported an invalid annualEnergySoldTypeCode of ${invalidCodeObj.column1}.`)
            const co2EmissionRateUnitsOfMeasureCodeErrors = results[29].map(invalidCodeObj => `You reported an invalid co2EmissionRateUnitsOfMeasureCode of ${invalidCodeObj.column1}.`)

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

    collectDailyEmissionsCodes(payload: DailyEmissionImportDTO[]) {
        payload.forEach(dailyEm => {

            this.collectCode(dailyEm, "parameterCode");

            dailyEm.dailyFuelData.forEach(dailyFuel => {
                this.collectCode(dailyFuel, "fuelCode");
            })
        });
    }

    collectWeeklyTestSummaryCodes(payload: WeeklyTestSummaryImportDTO[]) {
        payload.forEach(wts => {
            this.collectCode(wts, "testTypeCode");
            this.collectCode(wts, "testResultCode");
            this.collectCode(wts, "spanScaleCode");

            wts.weeklySystemIntegrityData.forEach(wsi => {
                this.collectCode(wsi, "gasLevelCode");
            })
        })
    }

    collectSummaryValueCodes(payload: SummaryValueImportDTO[]) {
        payload.forEach(summaryVal => {
            this.collectCode(summaryVal, "parameterCode");
        })
    }

    collectDailyTestSummary(payload: DailyTestSummaryImportDTO[]) {
        payload.forEach(dts => {
            this.collectCode(dts, "testTypeCode");
            this.collectCode(dts, "testResultCode");
            this.collectCode(dts, "spanScaleCode");

            dts.dailyCalibrationData.forEach(dailyCal => {
                this.collectCode(dailyCal, "upscaleGasCode");
                this.collectCode(dailyCal, "injectionProtocolCode");
                this.collectCode(dailyCal, "vendorIdentifier");
            })
        })
    }

    collectHourlyOperatingData(payload: HourlyOperatingImportDTO[]) {
        payload.forEach(hourlyOp => {
            this.collectCode(hourlyOp, "loadUnitsOfMeasureCode");
            this.collectCode(hourlyOp, "fuelCode");

            hourlyOp.monitorHourlyValueData.forEach(mhv => {
                this.collectCode(mhv, "parameterCode");
                this.collectCode(mhv, "modcCode");
            });

            hourlyOp.matsMonitorHourlyValueData.forEach(mmhv => {
                this.collectCode(mmhv, "parameterCode");
                this.collectCode(mmhv, "modcCode");
            });

            hourlyOp.derivedHourlyValueData.forEach(dhv => {
                this.collectCode(dhv, "parameterCode");
                this.collectCode(dhv, "modcCode");
                this.collectCode(dhv, "operatingConditionCode");
                this.collectCode(dhv, "fuelCode");
            });

            hourlyOp.matsDerivedHourlyValueData.forEach(mdhv => {
                this.collectCode(mdhv, "parameterCode");
                this.collectCode(mdhv, "modcCode");
            });

            hourlyOp.hourlyFuelFlowData.forEach(hff => {
                this.collectCode(hff, "fuelCode");
                this.collectCode(hff, "volumetricUnitsOfMeasureCode");
                this.collectCode(hff, "sourceOfDataVolumetricCode");
                this.collectCode(hff, "sourceOfDataMassCode");

                hff.hourlyParameterFuelFlowData.forEach(hpff => {
                    this.collectCode(hpff, "parameterCode");
                    this.collectCode(hpff, "sampleTypeCode");
                    this.collectCode(hpff, "operatingConditionCode");
                    this.collectCode(hpff, "parameterUnitsOfMeasureCode");
                });
            });

            hourlyOp.hourlyGFMData.forEach(hgfm => {
                this.collectCode(hgfm, "beginEndHourFlag");
            });
        })
    }

    collectLongTermFuelFlowData(payload: LongTermFuelFlowImportDTO[]){
        payload.forEach(ltff=>{
            this.collectCode(ltff, "fuelFlowPeriodCode");
            this.collectCode(ltff, "longTermFuelFlowUnitsOfMeasureCode");
            this.collectCode(ltff, "gcvUnitsOfMeasureCode");
        });
    }

    collectSorbentTrapData(payload: SorbentTrapImportDTO[]){
        payload.forEach(sorbentTrp =>{
            this.collectCode(sorbentTrp, "modcCode");
            this.collectCode(sorbentTrp, "apsCode");

            sorbentTrp.samplingTrainData.forEach(st => {
                this.collectCode(st, "samplingRatioCheckResultCode");
                this.collectCode(st, "postLeakCheckResultCode");
                this.collectCode(st, "trainQAStatusCode");
            });
        });
    }

    collectNsps4tSummary(payload: Nsps4tSummaryImportDTO[]){
        payload.forEach(nsps4t =>{
            this.collectCode(nsps4t, "co2EmissionStandardCode");
            this.collectCode(nsps4t, "modusUnitsOfMeasureCode");
            this.collectCode(nsps4t, "electricalLoadCode");

            nsps4t.nsps4tFourthQuarterData.forEach(nfq => {
                this.collectCode(nfq, "annualEnergySoldTypeCode");
            });

            nsps4t.nsps4tCompliancePeriodData.forEach( ncp => {
                this.collectCode(ncp, "co2EmissionRateUnitsOfMeasureCode");
            });
        })
    }

    // Helper function to put the codeField such as "fuelCode" from the datum into the codesMap.
    collectCode(datum, codeField: string) {
        if (isUndefinedOrNull(datum[codeField]))
            return;

        if (!this.codesMap.has(codeField))
            this.codesMap.set(codeField, new Set<string>());

        const codeSet: Set<string> = this.codesMap.get(codeField);
        codeSet.add(datum[codeField]);
    }

}

