import { IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { OpYear } from '../utils/validator.const';
import { ErrorMessages } from '../utils/error-messages';
import { IsValidNumber } from '../pipes/is-valid-number.pipe';
import { propertyMetadata } from '@us-epa-camd/easey-constants';
import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { IsInValidReportingQuarter } from '../pipes/is-in-valid-reporting-quarter.pipe';

export class MonthlyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @ApiProperty({
    isArray: true,
    description: propertyMetadata.year.description,
  })
  @OpYear()
  @IsDefined({ message: ErrorMessages.RequiredProperty() })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  year: number[];

  @ApiProperty({
    isArray: true,
    description: propertyMetadata.month.description,
  })
  @IsDefined({ message: ErrorMessages.RequiredProperty() })
  @IsValidNumber(12, {
    each: true,
    message: ErrorMessages.MultipleFormat('month', 'M or MM format'),
  })
  @IsInValidReportingQuarter([3, 6, 9], 'year', {
    each: true,
    message: ErrorMessages.DateRange(
      'month',
      true,
      `a month between 01/01/1995 and the end of the calendar quarter, ${ErrorMessages.ReportingQuarter()}`,
    ),
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  month: number[];
}
