import {
  HrlyParamFuelFlowImportDTO,
  HrlyParamFuelFlowRecordDTO,
} from './hrly-param-fuel-flow.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class HrlyFuelFlowBaseDTO {
  fuelCode: string;
  fuelUsageTime?: number;
  volumetricFlowRate?: number;
  volumetricUnitsOfMeasureCode?: string;
  sourceOfDataVolumetricCode?: string;
  massFlowRate?: number;
  sourceOfDataMassCode?: string;
  monitoringSystemId?: string;
}

export class HrlyFuelFlowRecordDTO extends HrlyFuelFlowBaseDTO {
  id: string;
  hourId: string;
  calcMassFlowRate?: number;
  userId?: string;
  addDate?: Date;
  updateDate?: Date;
  calcVolumetricFlowRate?: number;
  calcAppdStatus?: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
}

export class HourlyFuelFlowImportDTO extends HrlyFuelFlowBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => HrlyParamFuelFlowImportDTO)
  hourlyParameterFuelFlowData: HrlyParamFuelFlowImportDTO[];
}

export class HourlyFuelFlowDTO extends HrlyFuelFlowRecordDTO {
  @ValidateNested({ each: true })
  @Type(() => HrlyParamFuelFlowRecordDTO)
  hourlyParameterFuelFlowData: HrlyParamFuelFlowRecordDTO[];
}
