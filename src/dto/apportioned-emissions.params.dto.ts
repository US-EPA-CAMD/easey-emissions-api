import { Transform } from 'class-transformer';
import { IsDefined, IsOptional } from 'class-validator';

import { ErrorMessages } from '../utils/error-messages';
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
import { IsControlTechnology } from '../pipes/is-control-technology.pipe';
import { IsUnitFuelType } from '../pipes/is-unit-fuel-type.pipe';
import { IsOrisCode } from '../pipes/is-oris-code.pipe';
import { IsUnitType } from '../pipes/is-unit-type.pipe';
import { IsStateCode } from '../pipes/is-state-code.pipe';

export class ApportionedEmissionsParamsDTO extends PaginationDTO {
  @IsInDateRange([new Date('1995-01-01'), new Date()], {
    message: ErrorMessages.FV7,
  })
  @IsValidDate({
    message: ErrorMessages.FV11,
  })
  @IsIsoFormat({
    message: ErrorMessages.FV5,
  })
  @IsDefined()
  beginDate: Date;

  @IsDateGreaterThanEqualTo('beginDate', {
    message: ErrorMessages.FV6,
  })
  @IsInDateRange([new Date('1995-01-01'), new Date()], {
    message: ErrorMessages.FV7,
  })
  @IsValidDate({
    message: ErrorMessages.FV11,
  })
  @IsIsoFormat({
    message: ErrorMessages.FV5,
  })
  @IsDefined()
  endDate: Date;

  @IsOptional()
  @IsStateCode({
    each: true,
    message: ErrorMessages.FV4,
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  state?: State[];

  @IsOptional()
  @IsOrisCode({
    each: true,
    message: ErrorMessages.FV9,
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  orisCode?: number[];

  @IsOptional()
  @IsUnitType({
    each: true,
    message: ErrorMessages.FV1,
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  unitType?: UnitType[];

  @IsOptional()
  @IsUnitFuelType({
    each: true,
    message: ErrorMessages.FV2,
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  unitFuelType?: UnitFuelType[];

  @IsOptional()
  @IsControlTechnology({
    each: true,
    message: ErrorMessages.FV3,
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  controlTechnologies?: ControlTechnology[];

  @IsOptional()
  @IsProgram(['MATS'], {
    each: true,
    message: ErrorMessages.FV12 + '?exclude=MATS',
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  program?: Program[];
}
