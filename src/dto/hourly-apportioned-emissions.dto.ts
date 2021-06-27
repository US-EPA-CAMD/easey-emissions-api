import { ApiProperty } from '@nestjs/swagger';

import { propertyMetadata } from '@us-epa-camd/easey-constants';
import { ApportionedEmissionsDTO } from './apportioned-emissions.dto';

export class HourlyApportionedEmissionsDTO extends ApportionedEmissionsDTO {
  @ApiProperty(propertyMetadata.date)
  opDate: string;

  @ApiProperty(propertyMetadata.hour)
  opHour: number;

  @ApiProperty(propertyMetadata.opTime)
  opTime: number;

  @ApiProperty(propertyMetadata.so2MassMeasureFlg)  
  so2MassMeasureFlg: string;

  @ApiProperty(propertyMetadata.so2RateMeasureFlg)
  so2RateMeasureFlg: string;

  @ApiProperty(propertyMetadata.noxMassMeasureFlg)
  noxMassMeasureFlg: string;

  @ApiProperty(propertyMetadata.noxRateMeasureFlg)
  noxRateMeasureFlg: string;

  @ApiProperty(propertyMetadata.co2MassMeasureFlg)
  co2MassMeasureFlg: string;

  @ApiProperty(propertyMetadata.co2RateMeasureFlg)
  co2RateMeasureFlg: string;
}
