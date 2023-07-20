import {
  HourlyParamFuelFlowDTO,
  HourlyParamFuelFlowImportDTO,
} from './hourly-param-fuel-flow.dto';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import { FuelCode } from '../entities/fuel-code.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';
import { UnitsOfMeasureCode } from '../entities/units-of-measure.entity';
import { SodVolumetricCode } from '../entities/sod-volumetri-code.entity';
import { SodMassCode } from '../entities/sod-mass-code.entity';

export class HourlyFuelFlowBaseDTO {
  @IsString()
  @IsValidCode(FuelCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  fuelCode: string;

  @IsNumber()
  @IsOptional()
  fuelUsageTime?: number;

  @IsNumber()
  @IsOptional()
  volumetricFlowRate?: number;

  @IsString()
  @IsOptional()
  @IsValidCode(UnitsOfMeasureCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  volumetricUnitsOfMeasureCode?: string;

  @IsString()
  @IsOptional()
  @IsValidCode(SodVolumetricCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  sourceOfDataVolumetricCode?: string;

  @IsNumber()
  @IsOptional()
  massFlowRate?: number;

  @IsString()
  @IsOptional()
  @IsValidCode(SodMassCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  sourceOfDataMassCode?: string;

  @IsString()
  @IsOptional()
  monitoringSystemId?: string;
}

export class HourlyFuelFlowRecordDTO extends HourlyFuelFlowBaseDTO {
  id: string;
  hourId: string;
  monitoringSystemRecordId?: string;
  calcMassFlowRate?: number;
  userId?: string;
  addDate?: string;
  updateDate?: string;
  calcVolumetricFlowRate?: number;
  calcAppdStatus?: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
}

export class HourlyFuelFlowImportDTO extends HourlyFuelFlowBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => HourlyParamFuelFlowImportDTO)
  hourlyParameterFuelFlowData: HourlyParamFuelFlowImportDTO[];
}

export class HourlyFuelFlowDTO extends HourlyFuelFlowRecordDTO {
  @ValidateNested({ each: true })
  @Type(() => HourlyParamFuelFlowDTO)
  hourlyParameterFuelFlowData: HourlyParamFuelFlowDTO[];
}
