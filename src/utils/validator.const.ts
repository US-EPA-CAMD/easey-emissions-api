import { applyDecorators } from '@nestjs/common';
import { IsDefined } from 'class-validator';

import { IsInDateRange } from '../pipes/is-in-date-range.pipe';
import { IsValidDate } from '../pipes/is-valid-date.pipe';
import { IsIsoFormat } from '../pipes/is-iso-format.pipe';
import { IsDateGreaterThanEqualTo } from '../pipes/is-date-greater.pipe';
import { ErrorMessages } from './error-messages';

export function BeginDate() {
  return applyDecorators(
    IsInDateRange([new Date('1995-01-01'), new Date()], false, true, {
      message: ErrorMessages.DateRange(
        'beginDate',
        false,
        `a date between 01/01/1995 and the end of the calendar quarter, ${ErrorMessages.ReportingQuarter()}`,
      ),
    }),
    IsValidDate({
      message: ErrorMessages.DateValidity(),
    }),
    IsIsoFormat({
      message: ErrorMessages.SingleFormat('beginDate', 'YYYY-MM-DD'),
    }),
    IsDefined({
      message: ErrorMessages.RequiredProperty(),
    }),
  );
}

export function EndDate() {
  return applyDecorators(
    IsDateGreaterThanEqualTo('beginDate', {
      message: ErrorMessages.BeginEndDate('beginDate'),
    }),
    IsInDateRange([new Date('1995-01-01'), new Date()], false, true, {
      message: ErrorMessages.DateRange(
        'endDate',
        false,
        `a date between 01/01/1995 and the end of the calendar quarter, ${ErrorMessages.ReportingQuarter()}`,
      ),
    }),
    IsValidDate({
      message: ErrorMessages.DateValidity(),
    }),
    IsIsoFormat({
      message: ErrorMessages.SingleFormat('endDate', 'YYYY-MM-DD'),
    }),
    IsDefined({ message: ErrorMessages.RequiredProperty() }),
  );
}
