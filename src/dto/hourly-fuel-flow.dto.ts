import {
  HourlyParamFuelFlowDTO,
  HourlyParamFuelFlowImportDTO,
} from './hourly-param-fuel-flow.dto';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class HourlyFuelFlowBaseDTO {
  @IsString()
  fuelCode: string;

  @IsNumber()
  @IsOptional()
  fuelUsageTime?: number;

  @IsNumber()
  @IsOptional()
  volumetricFlowRate?: number;

  @IsString()
  @IsOptional()
  volumetricUnitsOfMeasureCode?: string;

  @IsString()
  @IsOptional()
  sourceOfDataVolumetricCode?: string;

  @IsNumber()
  @IsOptional()
  massFlowRate?: number;

  @IsString()
  @IsOptional()
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
  addDate?: Date;
  updateDate?: Date;
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
