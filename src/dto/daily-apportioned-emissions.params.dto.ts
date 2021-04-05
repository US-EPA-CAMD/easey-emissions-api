import { IsDefined } from 'class-validator';

import { ErrorMessages } from '../utils/error-messages';
import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { IsInDateRange } from '../pipes/is-in-date-range.pipe';
import { IsValidDate } from '../pipes/is-valid-date.pipe';
import { IsIsoFormat } from '../pipes/is-iso-format.pipe';
import { IsDateGreaterThanEqualTo } from '../pipes/is-date-greater.pipe';

export class DailyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @IsInDateRange([new Date('1995-01-01'), new Date()], {
    message: ErrorMessages.FV7,
  })
  @IsValidDate({
    message: ErrorMessages.FV11,
  })
  @IsIsoFormat({
    message: ErrorMessages.FV5,
  })
  @IsDefined()
  beginDate: Date;

  @IsDateGreaterThanEqualTo('beginDate', {
    message: ErrorMessages.FV6,
  })
  @IsInDateRange([new Date('1995-01-01'), new Date()], {
    message: ErrorMessages.FV7,
  })
  @IsValidDate({
    message: ErrorMessages.FV11,
  })
  @IsIsoFormat({
    message: ErrorMessages.FV5,
  })
  @IsDefined()
  endDate: Date;
}
