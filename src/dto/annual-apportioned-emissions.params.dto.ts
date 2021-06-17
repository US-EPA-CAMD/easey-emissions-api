import { IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';

import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { IsInDateRange } from '../pipes/is-in-date-range.pipe';
import { ErrorMessages } from '../utils/error-messages';
import { IsYearFormat } from '../pipes/is-year-format.pipe';

export class AnnualApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @IsInDateRange([new Date(1995, 0), new Date()], true, true, true, {
    each: true,
    message: ErrorMessages.DateRange(
      'opYear',
      true,
      '1980, 1985, 1990, or to a year greater than or equal to 1995',
    ),
  })
  @IsYearFormat({
    each: true,
    message: ErrorMessages.MultipleFormat('opYear', 'YYYY format'),
  })
  @IsDefined({ message: ErrorMessages.RequiredProperty() })
  opYear: number[];
}
