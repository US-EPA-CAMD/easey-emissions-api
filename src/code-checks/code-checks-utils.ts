import { BaseEntity, EntityManager, Repository } from 'typeorm';
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
  manager: EntityManager,
) => {
  if (!codeSet || codeSet.size === 0) return [];

  const tableName = entityRepo.metadata.tableName;
  const codeColumn = entityRepo.metadata.primaryColumns[0].databaseName;

  const codeList = Array.from(codeSet);

  const formattedCodes = codeList.map(code => `('${code}')`);
  const sql = `
    VALUES ${formattedCodes.join(',')}
    EXCEPT
    SELECT ${codeColumn} FROM ${tableName}
    `;

  return await manager.query(sql);
};

export const getCodeFieldRepoList = (mgr: EntityManager): CodeFieldRepo[] => {
  return [
    {
      codeField: 'parameterCode',
      codeRepo: mgr.getRepository(ParameterCode),
    },
    {
      codeField: 'fuelCode',
      codeRepo: mgr.getRepository(FuelCode),
    },
    {
      codeField: 'testTypeCode',
      codeRepo: mgr.getRepository(TestTypeCode),
    },
    {
      codeField: 'testResultCode',
      codeRepo: mgr.getRepository(TestResultCode),
    },
    {
      codeField: 'spanScaleCode',
      codeRepo: mgr.getRepository(SpanScaleCode),
    },
    {
      codeField: 'gasLevelCode',
      codeRepo: mgr.getRepository(GasLevelCode),
    },
    {
      codeField: 'upscaleGasCode',
      codeRepo: mgr.getRepository(GasLevelCode),
    },
    {
      codeField: 'injectionProtocolCode',
      codeRepo: mgr.getRepository(InjectionProtocolCode),
    },
    {
      codeField: 'vendorIdentifier',
      codeRepo: mgr.getRepository(ProtocolGasVendor),
    },
    {
      codeField: 'loadUnitsOfMeasureCode',
      codeRepo: mgr.getRepository(UnitsOfMeasureCode),
    },
    {
      codeField: 'modcCode',
      codeRepo: mgr.getRepository(ModcCode),
    },
    {
      codeField: 'operatingConditionCode',
      codeRepo: mgr.getRepository(OperatingConditionCode),
    },
    {
      codeField: 'volumetricUnitsOfMeasureCode',
      codeRepo: mgr.getRepository(UnitsOfMeasureCode),
    },
    {
      codeField: 'sourceOfDataVolumetricCode',
      codeRepo: mgr.getRepository(SodVolumetricCode),
    },
    {
      codeField: 'sourceOfDataMassCode',
      codeRepo: mgr.getRepository(SodMassCode),
    },
    {
      codeField: 'sampleTypeCode',
      codeRepo: mgr.getRepository(SampleTypeCode),
    },
    {
      codeField: 'parameterUnitsOfMeasureCode',
      codeRepo: mgr.getRepository(UnitsOfMeasureCode),
    },
    {
      codeField: 'beginEndHourFlag',
      codeRepo: mgr.getRepository(BeginEndHourFlag),
    },
    {
      codeField: 'fuelFlowPeriodCode',
      codeRepo: mgr.getRepository(FuelFlowPeriodCode),
    },
    {
      codeField: 'longTermFuelFlowUnitsOfMeasureCode',
      codeRepo: mgr.getRepository(UnitsOfMeasureCode),
    },
    {
      codeField: 'gcvUnitsOfMeasureCode',
      codeRepo: mgr.getRepository(UnitsOfMeasureCode),
    },
    {
      codeField: 'apsCode',
      codeRepo: mgr.getRepository(SorbentTrapApsCode),
    },
    {
      codeField: 'samplingRatioCheckResultCode',
      codeRepo: mgr.getRepository(TestResultCode),
    },
    {
      codeField: 'postLeakCheckResultCode',
      codeRepo: mgr.getRepository(TestResultCode),
    },
    {
      codeField: 'trainQAStatusCode',
      codeRepo: mgr.getRepository(TrainQaStatusCode),
    },
    {
      codeField: 'co2EmissionStandardCode',
      codeRepo: mgr.getRepository(Nsps4tEmissionStandardCode),
    },
    {
      codeField: 'modusUnitsOfMeasureCode',
      codeRepo: mgr.getRepository(UnitsOfMeasureCode),
    },
    {
      codeField: 'electricalLoadCode',
      codeRepo: mgr.getRepository(Nsps4tElectricalLoadCode),
    },
    {
      codeField: 'annualEnergySoldTypeCode',
      codeRepo: mgr.getRepository(Nsps4tElectricalLoadCode),
    },
    {
      codeField: 'co2EmissionRateUnitsOfMeasureCode',
      codeRepo: mgr.getRepository(UnitsOfMeasureCode),
    },
  ];
};
