import { applyDecorators } from '@nestjs/common';
import { IsDefined } from 'class-validator';

import { IsInDateRange } from '../pipes/is-in-date-range.pipe';
import { IsValidDate } from '../pipes/is-valid-date.pipe';
import { IsIsoFormat } from '../pipes/is-iso-format.pipe';
import { IsDateGreaterThanEqualTo } from '../pipes/is-date-greater.pipe';
import { ErrorMessages } from './error-messages';

export function BeginDate() {
  return applyDecorators(
    IsInDateRange([new Date('1995-01-01'), new Date()], false, {
      message: ErrorMessages.DateRange(
        'beginDate',
        false,
        'a year between 1995 and this year',
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
    IsInDateRange([new Date('1995-01-01'), new Date()], false, {
      message: ErrorMessages.DateRange(
        'endDate',
        false,
        'a year between 1995 and this year',
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
