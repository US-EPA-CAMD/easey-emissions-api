import {
  isInt,
  IsInt,
  IsOptional,
  IsPositive,
  Max,
  Validate,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationDTO } from './pagination.dto';
import { ControlTechnology } from '../enums/control-technology.enum';
import { UnitFuelType } from '../enums/unit-fuel-type.enum';
import { UnitType } from '../enums/unit-type.enum';
import { State } from '../enums/state.enum';
import { Transform } from 'class-transformer/decorators';
import { OrisCodeValidation } from '../pipes/oris-code-validation.pipes';

export class HourlyApportionedEmissionsParamsDTO extends PaginationDTO {
  @IsOptional()
  @ApiPropertyOptional()
  beginDate: Date;

  @IsOptional()
  @ApiPropertyOptional()
  endDate: Date;

  @IsOptional()
  @ApiPropertyOptional()
  state: State;

  @IsOptional()
  @ApiPropertyOptional()
  @Transform(val => Number.parseFloat(val))
  @Validate(OrisCodeValidation)
  orisCode: number;

  @IsOptional()
  @ApiPropertyOptional()
  unitType: UnitType;

  @IsOptional()
  @ApiPropertyOptional()
  unitFuelType: UnitFuelType;

  @IsOptional()
  @ApiPropertyOptional()
  controlTechnologies: ControlTechnology;

  @IsOptional()
  @ApiPropertyOptional()
  opHoursOnly: boolean;
}
