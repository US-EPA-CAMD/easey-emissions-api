import { IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-constants';

import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { ErrorMessages } from '../utils/error-messages';

export class OzoneApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @IsDefined({ message: ErrorMessages.RequiredProperty() })
  @ApiProperty({
    isArray: true,
    description: propertyMetadata.year.description,
  })
  opYear: number[];
}
