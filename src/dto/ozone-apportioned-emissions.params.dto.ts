import { IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';

import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { ErrorMessages } from '../utils/error-messages';

export class OzoneApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @IsDefined({ message: ErrorMessages.RequiredProperty() })
  opYear: number[];
}
