import { IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';

import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { ErrorMessages } from '../utils/error-messages';
import { IsYearFormat } from '../pipes/is-year-format.pipe';
import { IsInDateRange } from '../pipes/is-in-date-range.pipe';
import { IsValidNumber } from '../pipes/is-valid-number.pipe';
import { IsInValidReportingQuarter } from '../pipes/is-in-valid-reporting-quarter.pipe';

export class QuarterlyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
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
    message: ErrorMessages.MultipleFormat('opYear', 'YYYY format'),
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @IsDefined({ message: ErrorMessages.RequiredProperty() })
  opYear: number[];

  @IsValidNumber(4, {
    each: true,
    message: ErrorMessages.MultipleFormat(
      'opQuarter',
      'single digit format (ex.1,2,3,4)',
    ),
  })
  @IsInValidReportingQuarter([1, 2, 3], 'opYear', {
    each: true,
    message: ErrorMessages.DateRange(
      'opQuarter',
      true,
      `a quarter between 01/01/1995 and the end of the calendar quarter, ${ErrorMessages.ReportingQuarter()}`,
    ),
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @IsDefined({ message: ErrorMessages.RequiredProperty() })
  opQuarter: number[];
}
