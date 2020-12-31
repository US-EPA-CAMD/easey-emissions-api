import { IsOptional, Validate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationDTO } from './pagination.dto';
import { ControlTechnology } from '../enums/control-technology.enum';
import { UnitFuelType } from '../enums/unit-fuel-type.enum';
import { UnitType } from '../enums/unit-type.enum';
import { State } from '../enums/state.enum';
import { OrisCodeValidation } from '../pipes/oris-code-validation.pipes';
import { StateValidation } from '../pipes/state-validation.pipes';
import { DateValidation } from '../pipes/date-validation.pipes';

export class HourlyApportionedEmissionsParamsDTO extends PaginationDTO {
  @IsOptional()
  @ApiPropertyOptional()
  @Validate(DateValidation)
  beginDate: Date;

  @IsOptional()
  @ApiPropertyOptional()
  @Validate(DateValidation)
  endDate: Date;

  @IsOptional()
  @ApiPropertyOptional()
  @Validate(StateValidation)
  state: State;

  @IsOptional()
  @ApiPropertyOptional()
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
