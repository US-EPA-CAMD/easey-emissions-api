import { BaseEntity, Repository, getManager } from 'typeorm';
import { ParameterCode } from '../entities/parameter-code.entity';
import { FuelCode } from '../entities/fuel-code.entity';
import { TestTypeCode } from '../entities/test-type-code.entity';
import { TestResultCode } from '../entities/test-result-code.entity';
import { SpanScaleCode } from '../entities/span-scale-code.entity';
import { GasLevelCode } from '../entities/gas-level-code.entity';
import { InjectionProtocolCode } from '../entities/injection-protocol-codes.entity';
import { ProtocolGasVendor } from '../entities/protocol-gas-vendor.entity';
import { UnitsOfMeasureCode } from '../entities/units-of-measure.entity';
import { ModcCode } from '../entities/modc-code.entity';
import { OperatingConditionCode } from '../entities/operating-condition-code.entity';
import { SodVolumetricCode } from '../entities/sod-volumetri-code.entity';
import { SodMassCode } from '../entities/sod-mass-code.entity';
import { SampleTypeCode } from '../entities/sample-type-code.entity';
import { BeginEndHourFlag } from '../entities/begin-end-hour-flag.entity';
import { FuelFlowPeriodCode } from '../entities/fuel-flow-period-code.entity';
import { SorbentTrapApsCode } from '../entities/sorbent-trap-aps-code.entity';
import { TrainQaStatusCode } from '../entities/train-qa-status-code.entity';
import { Nsps4tEmissionStandardCode } from '../entities/nsps4t-emission-standard-code.entity';
import { Nsps4tElectricalLoadCode } from '../entities/nsps4t-electrical-load-code.entity';

export type CodeFieldRepo = {
  codeField: string;
  codeRepo: Repository<BaseEntity>;
};

export const getErrorMessage = (property, value) =>
  `You reported an invalid ${property} of ${value}.`;

export const getInvalidCodes = async (
  codeSet: Set<string>,
  entityRepo: Repository<BaseEntity>,
) => {
  if (!codeSet || codeSet.size === 0) return [];

  const tableName = entityRepo.metadata.tableName;
  const codeColumn = entityRepo.metadata.primaryColumns[0].databaseName;

  const manager = getManager();
  const codeList = Array.from(codeSet);

  const formattedCodes = codeList.map(code => `('${code}')`);
  const sql = `
    VALUES ${formattedCodes.join(',')}
    EXCEPT
    SELECT ${codeColumn} FROM ${tableName}
    `;

  return await manager.query(sql);
};

export const getCodeFieldRepoList = (): CodeFieldRepo[] => {
  return [
    {
      codeField: 'parameterCode',
      codeRepo: ParameterCode.getRepository(),
    },
    {
      codeField: 'fuelCode',
      codeRepo: FuelCode.getRepository(),
    },
    {
      codeField: 'testTypeCode',
      codeRepo: TestTypeCode.getRepository(),
    },
    {
      codeField: 'testResultCode',
      codeRepo: TestResultCode.getRepository(),
    },
    {
      codeField: 'spanScaleCode',
      codeRepo: SpanScaleCode.getRepository(),
    },
    {
      codeField: 'gasLevelCode',
      codeRepo: GasLevelCode.getRepository(),
    },
    {
      codeField: 'upscaleGasCode',
      codeRepo: GasLevelCode.getRepository(),
    },
    {
      codeField: 'injectionProtocolCode',
      codeRepo: InjectionProtocolCode.getRepository(),
    },
    {
      codeField: 'vendorIdentifier',
      codeRepo: ProtocolGasVendor.getRepository(),
    },
    {
      codeField: 'loadUnitsOfMeasureCode',
      codeRepo: UnitsOfMeasureCode.getRepository(),
    },
    {
      codeField: 'modcCode',
      codeRepo: ModcCode.getRepository(),
    },
    {
      codeField: 'operatingConditionCode',
      codeRepo: OperatingConditionCode.getRepository(),
    },
    {
      codeField: 'volumetricUnitsOfMeasureCode',
      codeRepo: UnitsOfMeasureCode.getRepository(),
    },
    {
      codeField: 'sourceOfDataVolumetricCode',
      codeRepo: SodVolumetricCode.getRepository(),
    },
    {
      codeField: 'sourceOfDataMassCode',
      codeRepo: SodMassCode.getRepository(),
    },
    {
      codeField: 'sampleTypeCode',
      codeRepo: SampleTypeCode.getRepository(),
    },
    {
      codeField: 'parameterUnitsOfMeasureCode',
      codeRepo: UnitsOfMeasureCode.getRepository(),
    },
    {
      codeField: 'beginEndHourFlag',
      codeRepo: BeginEndHourFlag.getRepository(),
    },
    {
      codeField: 'fuelFlowPeriodCode',
      codeRepo: FuelFlowPeriodCode.getRepository(),
    },
    {
      codeField: 'longTermFuelFlowUnitsOfMeasureCode',
      codeRepo: UnitsOfMeasureCode.getRepository(),
    },
    {
      codeField: 'gcvUnitsOfMeasureCode',
      codeRepo: UnitsOfMeasureCode.getRepository(),
    },
    {
      codeField: 'apsCode',
      codeRepo: SorbentTrapApsCode.getRepository(),
    },
    {
      codeField: 'samplingRatioCheckResultCode',
      codeRepo: TestResultCode.getRepository(),
    },
    {
      codeField: 'postLeakCheckResultCode',
      codeRepo: TestResultCode.getRepository(),
    },
    {
      codeField: 'trainQAStatusCode',
      codeRepo: TrainQaStatusCode.getRepository(),
    },
    {
      codeField: 'co2EmissionStandardCode',
      codeRepo: Nsps4tEmissionStandardCode.getRepository(),
    },
    {
      codeField: 'modusUnitsOfMeasureCode',
      codeRepo: UnitsOfMeasureCode.getRepository(),
    },
    {
      codeField: 'electricalLoadCode',
      codeRepo: Nsps4tElectricalLoadCode.getRepository(),
    },
    {
      codeField: 'annualEnergySoldTypeCode',
      codeRepo: Nsps4tElectricalLoadCode.getRepository(),
    },
    {
      codeField: 'co2EmissionRateUnitsOfMeasureCode',
      codeRepo: UnitsOfMeasureCode.getRepository(),
    },
  ];
};
