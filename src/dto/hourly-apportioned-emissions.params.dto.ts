import { IsOptional } from 'class-validator';

import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { BeginDate, EndDate } from '../utils/validator.const';

export class HourlyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @BeginDate()
  beginDate: Date;

  @EndDate()
  endDate: Date;

  @IsOptional()
  opHoursOnly?: boolean;
}
