import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmptyString } from '@us-epa-camd/easey-common/pipes';
import { ErrorMessages } from '@us-epa-camd/easey-common/constants';
import moment from 'moment/moment';

export class DerivedHourlyValueParamsDto {
  @ApiProperty()
  @Transform(({ value }) => {
    if (value) {
      return value.split('|').map((item: string) => Number(item.trim()));
    }
  })
  orisCode: number[];

  @ApiProperty()
  @Transform(({ value }) => {
    if (value) {
      return value.split('|').map((item: string) => item.trim());
    }
  })
  locationName: string[];

  @ApiProperty()
  @IsNotEmptyString({ message: ErrorMessages.RequiredProperty() })
  @Transform(date => moment(date.value).format('YYYY-MM-DD'))
  beginDate: Date;

  @ApiProperty()
  @IsNotEmptyString({ message: ErrorMessages.RequiredProperty() })
  @Transform(date => moment(date.value).format('YYYY-MM-DD'))
  endDate: Date;
}
