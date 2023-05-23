import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { FuelCode } from '../entities/fuel-code.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';

export class DailyFuelBaseDTO {
  @IsString()
  @IsValidCode(FuelCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  fuelCode: string;

  @IsOptional()
  @IsNumber()
  dailyFuelFeed?: number;

  @IsNumber()
  carbonContentUsed: number;

  @IsOptional()
  @IsNumber()
  fuelCarbonBurned?: number;
}

export class DailyFuelRecordDTO extends DailyFuelBaseDTO {
  id: string;
  dailyEmissionId: string;
  calcFuelCarbonBurned?: number;
  userId: string;
  addDate?: string;
  updateDate?: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
}

export class DailyFuelImportDTO extends DailyFuelBaseDTO {}

export class DailyFuelDTO extends DailyFuelRecordDTO {}
