import { IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';

import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { IsInDateRange } from '../pipes/is-in-date-range.pipe';
import { IsValidMonthNumber } from '../pipes/is-valid-month-number.pipe';
import { IsYearFormat } from '../pipes/is-year-format.pipe';
import { ErrorMessages } from '../utils/error-messages';
import { IsValidMonth } from '../pipes/is-valid-month.pipe';

export class MonthlyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @IsInDateRange([new Date(1995, 0), new Date()], true, true, {
    each: true,
    message: ErrorMessages.DateRange(
      'opYear',
      true,
      'a year between 1995 and this year',
    ),
  })
  @IsYearFormat({
    each: true,
    message: ErrorMessages.MultipleFormat('opYear', 'YYYY'),
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @IsDefined({ message: ErrorMessages.RequiredProperty() })
  opYear: number[];

  @IsValidMonthNumber({
    each: true,
    message: ErrorMessages.MultipleFormat('opMonth', 'M or MM'),
  })
  @IsValidMonth('opYear', {
    each: true,
    message: ErrorMessages.DateRange(
      'opMonth',
      true,
      `a month between 01/01/1995 and the end of the calendar quarter, ${ErrorMessages.ReportingQuarter()}`,
    ),
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @IsDefined({ message: ErrorMessages.RequiredProperty() })
  opMonth: number[];
}
