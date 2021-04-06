import { IsDefined } from 'class-validator';

import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';

export class MonthlyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @IsDefined()
  opYear: number;

  @IsDefined()
  opMonth: number;
}
