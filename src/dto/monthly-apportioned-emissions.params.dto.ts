import { IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';

import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';

export class MonthlyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @IsDefined()
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  opYear: number[];

  @IsDefined()
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  opMonth: number[];
}
