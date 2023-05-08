import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { FuelFlowPeriodCode } from '../entities/fuel-flow-period-code.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';
import { UnitsOfMeasureCode } from '../entities/units-of-measure.entity';

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
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  fuelFlowPeriodCode?: string;

  @IsNumber()
  longTermFuelFlowValue: number;

  @IsString()
  @IsValidCode(UnitsOfMeasureCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  longTermFuelFlowUomCode: string;

  @IsOptional()
  @IsNumber()
  grossCalorificValue?: number;

  @IsOptional()
  @IsString()
  @IsValidCode(UnitsOfMeasureCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
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
