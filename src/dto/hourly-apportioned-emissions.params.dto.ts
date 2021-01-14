import { IsOptional, Validate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationDTO } from './pagination.dto';
import { ControlTechnology } from '../enums/control-technology.enum';
import { UnitFuelType } from '../enums/unit-fuel-type.enum';
import { UnitType } from '../enums/unit-type.enum';
import { State } from '../enums/state.enum';
import { IsOrisCode } from '../pipes/is-oris-code.pipe';
import { StateValidation } from '../pipes/state-validation.pipe';
import { DateValidation } from '../pipes/date-validation.pipe';
import { IsUnitType } from 'src/pipes/is-unit-type.pipe';
import { IsControlTechnology } from 'src/pipes/is-control-technology.pipe';

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
  @IsOrisCode({
    message:
      'ORIS code not valid. Refer to the list of available ORIS codes for valid values [placeholder for link to Facilities endpoint]',
  })
  orisCode: number;

  @IsOptional()
  @ApiPropertyOptional()
  @IsUnitType({
    message:
      'Unit type is not valid. Refer to the list of available unit types for valid values [placeholder for link to endpoint]',
  })
  unitType: UnitType;

  @IsOptional()
  @ApiPropertyOptional()
  unitFuelType: UnitFuelType;

  @IsOptional()
  @ApiPropertyOptional()
  @IsControlTechnology({
    message:
      'Control technologies are not valid. Refer to the list of available control technologies for valid values [placeholder for link to endpoint]',
  })
  controlTechnologies: ControlTechnology;

  @IsOptional()
  @ApiPropertyOptional()
  opHoursOnly: boolean;
}
