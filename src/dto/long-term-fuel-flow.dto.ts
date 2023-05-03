import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { FuelFlowPeriodCode } from '../entities/fuel-flow-period-code.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';
import { UnitsOfMeasureCode } from 'src/entities/units-of-measure.entity';

export class LongTermFuelFlowBaseDTO {
  @IsOptional()
  @IsString()
  stackPipeId?: string;

  @IsOptional()
  @IsString()
  unitId?: string;

  @IsString()
  monitoringSystemId: string;

  @IsOptional()
  @IsString()
  @IsValidCode(FuelFlowPeriodCode, {
    message: ImportCodeErrorMessage(),
  })
  fuelFlowPeriodCode?: string;

  @IsNumber()
  longTermFuelFlowValue: number;

  @IsString()
  @IsValidCode(UnitsOfMeasureCode, {
    message: ImportCodeErrorMessage(),
  })
  longTermFuelFlowUomCode: string;

  @IsOptional()
  @IsNumber()
  grossCalorificValue?: number;

  @IsOptional()
  @IsString()
  //need to double check code
  @IsValidCode(UnitsOfMeasureCode, {
    message: ImportCodeErrorMessage(),
  })
  gcvUnitsOfMeasureCode?: string;

  @IsOptional()
  @IsNumber()
  totalHeatInput?: number;
}

export class LongTermFuelFlowRecordDTO extends LongTermFuelFlowBaseDTO {
  id: string;
  reportingPeriodId?: number;
  monitoringLocationId?: string;
  monitoringSystemRecordId?: string;
  calcTotalHeatInput?: number;
  userId?: string;
  addDate?: Date;
  updateDate?: Date;
}

export class LongTermFuelFlowImportDTO extends LongTermFuelFlowBaseDTO {}

export class LongTermFuelFlowDTO extends LongTermFuelFlowRecordDTO {}
