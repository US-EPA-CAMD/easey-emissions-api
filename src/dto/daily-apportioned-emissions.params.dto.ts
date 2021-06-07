import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { BeginDate, EndDate } from '../utils/validator.const';
import { propertyMetadata } from '@us-epa-camd/easey-constants';
import { ApiProperty } from '@nestjs/swagger';

export class DailyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @BeginDate()
  @ApiProperty({ description: propertyMetadata.beginDate.description })
  beginDate: Date;

  @EndDate()
  @ApiProperty({ description: propertyMetadata.endDate.description })
  endDate: Date;
}
