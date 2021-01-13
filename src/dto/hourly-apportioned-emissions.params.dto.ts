import {
  IsDefined,
  IsOptional,
  Validate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationDTO } from './pagination.dto';
import { ControlTechnology } from '../enums/control-technology.enum';
import { UnitFuelType } from '../enums/unit-fuel-type.enum';
import { UnitType } from '../enums/unit-type.enum';
import { State } from '../enums/state.enum';
import { IsOrisCode } from '../pipes/is-oris-code.pipe';
import { StateValidation } from '../pipes/state-validation.pipe';
import { IsIsoFormat } from '../pipes/is-iso-format.pipe';
import { IsValidDate } from 'src/pipes/is-valid-date.pipe';
import { IsInDateRange } from '../pipes/is-in-date-range.pipe';
import { IsDateGreaterThanEqualTo } from '../pipes/is-date-greater.pipe';
import { IsControlTechnology } from 'src/pipes/is-control-technology.pipe';

export class HourlyApportionedEmissionsParamsDTO extends PaginationDTO {
  @ApiProperty()
  @IsInDateRange('1995-01-01', {
    message: 'Please enter a $property year between 1995 and this year',
  })
  @IsValidDate({
    message: 'Please enter a valid $property in the YYYY-MM-DD format',
  })
  @IsIsoFormat({
    message: 'Please enter the $property in the YYYY-MM-DD format',
  })
  @IsDefined()
  beginDate: Date;

  @ApiProperty()
  @IsDateGreaterThanEqualTo('beginDate', {
    message:
      'Please enter an end date that is equal to or greater than the begin date',
  })
  @IsInDateRange('1995-01-01', {
    message: 'Please enter an $property year between 1995 and this year',
  })
  @IsValidDate({
    message: 'Please enter a valid $property in the YYYY-MM-DD format',
  })
  @IsIsoFormat({
    message: 'Please enter the $property in the YYYY-MM-DD format',
  })
  @IsDefined()
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
