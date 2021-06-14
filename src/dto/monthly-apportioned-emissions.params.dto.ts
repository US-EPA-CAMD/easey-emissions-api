import { IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';

import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { IsValidNumber } from '../pipes/is-valid-number.pipe';
import { ErrorMessages } from '../utils/error-messages';
import { IsInValidReportingQuarter } from '../pipes/is-in-valid-reporting-quarter.pipe';
import { OpYear } from '../utils/validator.const';

export class MonthlyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @OpYear()
  @Transform((value: string) => value.split('|').map(item => item.trim()))
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
