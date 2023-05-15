import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { ErrorMessages } from '@us-epa-camd/easey-common/constants';
import {
  IsInDateRange,
  IsValidDate,
  IsIsoFormat,
  IsDateGreaterThanEqualTo,
  IsYearFormat,
  IsNotEmptyString,
  IsInRange,
  Min,
} from '@us-epa-camd/easey-common/pipes';
import { PAGINATION_MAX_PER_PAGE } from '../config/app.config';

export function BeginDate(isMats = false) {
  let date;
  if (isMats) {
    date = '2015-01-01';
  } else {
    date = '1995-01-01';
  }
  return applyDecorators(
    IsInDateRange(new Date(date), false, true, false, {
      message: ErrorMessages.DateRange(
        'beginDate',
        false,
        `a date between 01/01/${date.substring(
          0,
          4,
        )} and the quarter ending on ${ErrorMessages.ReportingQuarter()}`,
      ),
    }),
    IsValidDate({
      message: ErrorMessages.DateValidity(),
    }),
    IsIsoFormat({
      message: ErrorMessages.SingleFormat('beginDate', 'YYYY-MM-DD format'),
    }),
    IsNotEmpty({
      message: ErrorMessages.RequiredProperty(),
    }),
  );
}

export function EndDate(isMats = false) {
  let date;
  if (isMats) {
    date = '2015-01-01';
  } else {
    date = '1995-01-01';
  }
  return applyDecorators(
    IsDateGreaterThanEqualTo('beginDate', {
      message: ErrorMessages.BeginEndDate('beginDate'),
    }),
    IsInDateRange(new Date(date), false, true, false, {
      message: ErrorMessages.DateRange(
        'endDate',
        false,
        `a date between 01/01/${date.substring(
          0,
          4,
        )} and the quarter ending on ${ErrorMessages.ReportingQuarter()}`,
      ),
    }),
    IsValidDate({
      message: ErrorMessages.DateValidity(),
    }),
    IsIsoFormat({
      message: ErrorMessages.SingleFormat('endDate', 'YYYY-MM-DD format'),
    }),
    IsNotEmpty({ message: ErrorMessages.RequiredProperty() }),
  );
}

export function Page() {
  return applyDecorators(
    IsNotEmpty({ message: ErrorMessages.RequiredProperty() }),
    Min(1, {
      message: ErrorMessages.GreaterThanOrEqual('page', 1),
    }),
  );
}

export function PerPage() {
  return applyDecorators(
    IsNotEmpty({ message: ErrorMessages.RequiredProperty() }),
    IsInRange(1, PAGINATION_MAX_PER_PAGE, {
      message: ErrorMessages.Between('perPage', 1, PAGINATION_MAX_PER_PAGE),
    }),
  );
}

export function OpYear() {
  return applyDecorators(
    IsInDateRange(new Date(1995, 0), true, true, false, {
      each: true,
      message: ErrorMessages.DateRange(
        'year',
        true,
        `a year between 1995 and the quarter ending on ${ErrorMessages.ReportingQuarter()}`,
      ),
    }),
    IsYearFormat({
      each: true,
      message: ErrorMessages.MultipleFormat('year', 'YYYY format'),
    }),
    IsNotEmptyString({ message: ErrorMessages.RequiredProperty() }),
  );
}
