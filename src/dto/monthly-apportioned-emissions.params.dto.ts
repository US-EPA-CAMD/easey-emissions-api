import { IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';

import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { IsInDateRange } from '../pipes/is-in-date-range.pipe';
import { IsValidNumber } from '../pipes/is-valid-number.pipe';
import { IsYearFormat } from '../pipes/is-year-format.pipe';
import { ErrorMessages } from '../utils/error-messages';
import { IsInValidReportingQuarter } from '../pipes/is-in-valid-reporting-quarter.pipe';

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
    message: ErrorMessages.MultipleFormat('opYear', 'YYYY foramt'),
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @IsDefined({ message: ErrorMessages.RequiredProperty() })
  opYear: number[];

  @IsValidNumber(12, {
    each: true,
    message: ErrorMessages.MultipleFormat('opMonth', 'M or MM format'),
  })
  @IsInValidReportingQuarter([3, 6, 9], 'opYear', {
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
