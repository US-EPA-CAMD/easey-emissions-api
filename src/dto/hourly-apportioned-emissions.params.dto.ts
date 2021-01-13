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
import { IsUnitFuelType } from 'src/pipes/is-unit-fuel-type.pipe';

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
  unitType: UnitType;

  @IsOptional()
  @ApiPropertyOptional()
  @IsUnitFuelType({
    message:
      'Unit fuel type is not valid. Refer to the list of available unit fuel types for valid values [placeholder for link to endpoint]',
  })
  unitFuelType: UnitFuelType;

  @IsOptional()
  @ApiPropertyOptional()
  controlTechnologies: ControlTechnology;

  @IsOptional()
  @ApiPropertyOptional()
  opHoursOnly: boolean;
}
