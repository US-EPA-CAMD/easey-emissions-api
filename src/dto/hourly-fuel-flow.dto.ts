import {
  HourlyParamFuelFlowDTO,
  HourlyParamFuelFlowImportDTO,
} from './hourly-param-fuel-flow.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class HourlyFuelFlowBaseDTO {
  fuelCode: string;
  fuelUsageTime?: number;
  volumetricFlowRate?: number;
  volumetricUnitsOfMeasureCode?: string;
  sourceOfDataVolumetricCode?: string;
  massFlowRate?: number;
  sourceOfDataMassCode?: string;
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
