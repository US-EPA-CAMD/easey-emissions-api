import { IsDefined } from 'class-validator';

import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';

export class MonthlyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @IsDefined()
  year: number;

  @IsDefined()
  month: number;
}
