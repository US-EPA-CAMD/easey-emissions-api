import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import { BeginDate, EndDate } from '../utils/validator.const';

export class ApplicableMatsApportionedEmissionsAttributesParamsDTO {
  @ApiHideProperty()
  currentDate: Date = this.getCurrentDate;

  @ApiProperty({
    description: propertyMetadata.beginDate.description,
  })
  @BeginDate(true)
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.endDate.description,
  })
  @EndDate(true)
  endDate: Date;

  private get getCurrentDate(): Date {
    return new Date();
  }
}
