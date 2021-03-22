import { IsOptional } from 'class-validator';

import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';

export class HourlyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @IsOptional()
  opHoursOnly?: boolean;
}
