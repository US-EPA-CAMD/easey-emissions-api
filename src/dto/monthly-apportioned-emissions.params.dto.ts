import { IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';

import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';

export class MonthlyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @IsDefined()
  opYear: number[];

  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @IsDefined()
  opMonth: number[];
}
