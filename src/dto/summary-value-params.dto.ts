import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';
import { ErrorMessages } from '@us-epa-camd/easey-common/constants';

export class SummaryValueParamsDto {
  @ApiProperty()
  @IsArray({ message: ErrorMessages.RequiredProperty() })
  orisCodes: number[];

  @ApiProperty()
  @IsNumber()
  beginYear: number;

  @ApiProperty()
  @IsNumber()
  beginQuarter: number;

  @ApiProperty()
  @IsNumber()
  endYear: number;

  @ApiProperty()
  @IsNumber()
  endQuarter: number;
}
