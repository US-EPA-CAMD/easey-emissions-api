import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, Length } from 'class-validator';
import { IsNotEmptyString } from '@us-epa-camd/easey-common/pipes';
import { ErrorMessages } from '@us-epa-camd/easey-common/constants';
import moment from 'moment/moment';

export class DerivedHourlyValueParamsDto {
  @ApiProperty()
  @Transform(data => {
    let value = data.obj.orisCode;

    if (data.key === 'orisCode' && !Array.isArray(data.obj.orisCode)) {
      value = [data.obj.orisCode];
    }

    return value;
  })
  @IsArray()
  @IsNotEmptyString({ message: ErrorMessages.RequiredProperty(), each: true })
  @Length(1, 6, { each: true })
  orisCode: number[];

  @ApiProperty()
  @Transform(data => {
    let value = data.obj.locationName;

    if (data.key === 'locationName' && !Array.isArray(data.obj.locationName)) {
      value = [data.obj.locationName];
    }

    return value;
  })
  locationName: string[];

  @ApiProperty()
  @IsNotEmptyString()
  @Transform(date => moment(date.value).format('YYYY-MM-DD'))
  beginDate: Date;

  @ApiProperty()
  @IsNotEmptyString()
  @Transform(date => moment(date.value).format('YYYY-MM-DD'))
  endDate: Date;
}
