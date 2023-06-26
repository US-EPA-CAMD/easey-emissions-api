import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorMessages } from '@us-epa-camd/easey-common/constants';
import {
  IsNotEmptyString,
  IsValidNumber,
  IsYearFormat,
} from '@us-epa-camd/easey-common/pipes';
import { IsInYearAndQuarterRange } from '../pipes/is-in-year-and-quarter-range.pipe';

export class EmissionsParamsDTO {
  @ApiProperty()
  @IsNotEmptyString({ message: ErrorMessages.RequiredProperty() })
  monitorPlanId: string;

  @ApiProperty()
  @IsYearFormat({
    each: true,
    message: ErrorMessages.SingleFormat('year', 'YYYY format'),
  })
  @IsNotEmptyString({ message: ErrorMessages.RequiredProperty() })
  @IsInYearAndQuarterRange('quarter', {
    message:
      'The Year and Quarter cannot be before 2009 and cannot surpass the current date',
  })
  year: number;

  @ApiProperty()
  @IsValidNumber(4, {
    each: true,
    message: ErrorMessages.SingleFormat(
      'quarter',
      'single digit format (ex.1,2,3,4)',
    ),
  })
  @IsNotEmptyString({ message: ErrorMessages.RequiredProperty() })
  quarter: number;

  @IsOptional()
  @ApiProperty()
  @Transform(({ value }) => value === "true")
  reportedValuesOnly?: boolean;
}
