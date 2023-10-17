import {
  HourlyParamFuelFlowDTO,
  HourlyParamFuelFlowImportDTO,
} from './hourly-param-fuel-flow.dto';
import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { COMPONENT_MONITOR_SYS_REGEX } from '../constants/regex-list';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';

export class HourlyFuelFlowBaseDTO {
  @IsString()
  // @IsValidCode(FuelCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  fuelCode: string;

  @IsNumber()
  @IsOptional()
  @IsInRange(0, 9.99)
  fuelUsageTime?: number;

  @IsNumber()
  @IsOptional()
  @IsInRange(0, 9999999999.9)
  volumetricFlowRate?: number;

  @IsString()
  @IsOptional()
  // @IsValidCode(UnitsOfMeasureCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  volumetricUnitsOfMeasureCode?: string;

  @IsString()
  @IsOptional()
  // @IsValidCode(SodVolumetricCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  sourceOfDataVolumetricCode?: string;

  @IsNumber()
  @IsOptional()
  @IsInRange(-9999999999.9, 9999999999.9)
  massFlowRate?: number;

  @IsString()
  @IsOptional()
  // @IsValidCode(SodMassCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  sourceOfDataMassCode?: string;

  @IsString()
  @IsOptional()
  @Matches(COMPONENT_MONITOR_SYS_REGEX)
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
