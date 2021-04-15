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
      message: ErrorMessages.FV7,
    }),
    IsValidDate({
      message: ErrorMessages.FV11,
    }),
    IsIsoFormat({
      message: ErrorMessages.FV5,
    }),
    IsDefined(),
  );
}

export function EndDate() {
  return applyDecorators(
    IsDateGreaterThanEqualTo('beginDate', {
      message: ErrorMessages.FV6,
    }),
    IsInDateRange([new Date('1995-01-01'), new Date()], false, {
      message: ErrorMessages.FV7,
    }),
    IsValidDate({
      message: ErrorMessages.FV11,
    }),
    IsIsoFormat({
      message: ErrorMessages.FV5,
    }),
    IsDefined(),
  );
}
