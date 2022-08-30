import { ApiProperty } from '@nestjs/swagger';
import { ErrorMessages } from '@us-epa-camd/easey-common/constants';
import { IsNotEmptyString } from '@us-epa-camd/easey-common/pipes';

export class EmissionsParamsDTO {
  @ApiProperty()
  @IsNotEmptyString({ message: ErrorMessages.RequiredProperty() })
  monitorPlanId: string;

  @ApiProperty()
  @IsNotEmptyString({ message: ErrorMessages.RequiredProperty() })
  year: number;

  @ApiProperty()
  @IsNotEmptyString({ message: ErrorMessages.RequiredProperty() })
  quarter: number;
}
