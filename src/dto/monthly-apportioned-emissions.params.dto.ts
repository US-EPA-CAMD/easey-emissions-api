import { IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';

import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { IsInDateRange } from '../pipes/is-in-date-range.pipe';
import { IsValidMonthNumber } from '../pipes/is-valid-month-number.pipe';
import { IsYearFormat } from '../pipes/is-year-format.pipe';

export class MonthlyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @IsInDateRange([new Date(1995, 0), new Date()], true, {
    each: true,
    message:
      'All years must be between 1995 and this year (message to be updated)',
  })
  @IsYearFormat({
    each: true,
    message:
      'One or more years are not valid. Ensure all years are in the YYYY format',
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @IsDefined()
  opYear: number[];

  @IsValidMonthNumber({
    each: true,
    message:
      'One or more months are not valid. Ensure all months are between 1 and 12. ',
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @IsDefined()
  opMonth: number[];
}
