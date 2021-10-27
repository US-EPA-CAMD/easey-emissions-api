import { applyDecorators } from '@nestjs/common';
import { IsDefined } from 'class-validator';
import { ErrorMessages } from '@us-epa-camd/easey-common/constants';
import {
  IsInDateRange,
  IsValidDate,
  IsIsoFormat,
  IsDateGreaterThanEqualTo,
  IsYearFormat,
} from '@us-epa-camd/easey-common/pipes';

export function BeginDate() {
  return applyDecorators(
    IsInDateRange([new Date('1995-01-01'), new Date()], false, true, false, {
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
      message: ErrorMessages.SingleFormat('beginDate', 'YYYY-MM-DD format'),
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
    IsInDateRange([new Date('1995-01-01'), new Date()], false, true, false, {
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
      message: ErrorMessages.SingleFormat('endDate', 'YYYY-MM-DD format'),
    }),
    IsDefined({ message: ErrorMessages.RequiredProperty() }),
  );
}

export function OpYear() {
  return applyDecorators(
    IsInDateRange([new Date(1995, 0), new Date()], true, true, false, {
      each: true,
      message: ErrorMessages.DateRange(
        'year',
        true,
        'a year between 1995 and this year',
      ),
    }),
    IsYearFormat({
      each: true,
      message: ErrorMessages.MultipleFormat('year', 'YYYY format'),
    }),
    IsDefined({ message: ErrorMessages.RequiredProperty() }),
  );
}
