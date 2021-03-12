import { Transform } from 'class-transformer';
import { IsDefined, IsOptional } from 'class-validator';

import { PaginationDTO } from './pagination.dto';
import { ControlTechnology } from '../enums/control-technology.enum';
import { UnitFuelType } from '../enums/unit-fuel-type.enum';
import { UnitType } from '../enums/unit-type.enum';
import { State } from '../enums/state.enum';
import { IsIsoFormat } from '../pipes/is-iso-format.pipe';
import { IsValidDate } from '../pipes/is-valid-date.pipe';
import { IsInDateRange } from '../pipes/is-in-date-range.pipe';
import { IsDateGreaterThanEqualTo } from '../pipes/is-date-greater.pipe';
import { Program } from '../enums/program.enum';
import { IsProgram } from '../pipes/is-program.pipe';
import { ApiConfigService } from '../utils/api-config.service';
import { IsControlTechnology } from '../pipes/is-control-technology.pipe';
import { IsUnitFuelType } from '../pipes/is-unit-fuel-type.pipe';
import { IsOrisCode } from '../pipes/is-oris-code.pipe';
export class HourlyApportionedEmissionsParamsDTO extends PaginationDTO {
  @IsInDateRange([new Date('1995-01-01'), new Date()], {
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

  @IsDateGreaterThanEqualTo('beginDate', {
    message:
      'Please enter an $property that is greater than or equal to the $constraint1',
  })
  @IsInDateRange([new Date('1995-01-01'), new Date()], {
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
  // @IsStateCode({
  //   each: true,
  //   message:
  //     'The state or territory is not valid. Please enter a valid state or territory using the two letter postal abbreviation (use TX, not Texas).',
  // })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  state?: State[];

  @IsOptional()
  @IsOrisCode({
    each: true,
    message: `One or more ORIS codes are not valid. Refer to the list of available ORIS codes for valid values ${ApiConfigService.getFacApi()}facilities`,
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  orisCode?: number[];

  @IsOptional()
  // @IsUnitType({
  //   message:
  //     'Unit type is not valid. Refer to the list of available unit types for valid values [placeholder for link to endpoint]',
  // })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  unitType?: UnitType[];

  @IsOptional()
  @IsUnitFuelType({
    each: true,
    message: `One or more unit fuel types are not valid. Refer to the list of available unit fuel types for valid values ${ApiConfigService.getMdm()}fuel-types`,
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  unitFuelType?: UnitFuelType[];

  @IsOptional()
  @IsControlTechnology({
    each: true,
    message: `One or more control technologies are not valid. Refer to the list of available control technologies for valid values ${ApiConfigService.getMdm()}control-technologies`,
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  controlTechnologies?: ControlTechnology[];

  @IsOptional()
  @IsProgram(['MATS'], {
    each: true,
    message: `One or more programs is not valid. Refer to the list of available programs for valid values ${ApiConfigService.getMdm()}programs?exclude=MATS`,
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  program?: Program[];

  @IsOptional()
  opHoursOnly?: boolean;
}
