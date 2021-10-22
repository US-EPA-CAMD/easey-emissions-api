import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import { ApportionedEmissionsDTO } from './apportioned-emissions.dto';

export class HourlyApportionedEmissionsDTO extends ApportionedEmissionsDTO {
  @ApiProperty({
    description: propertyMetadata.date.description,
    example: propertyMetadata.date.example,
    name: propertyMetadata.date.fieldLabels.value,
  })
  date: string;

  @ApiProperty({
    description: propertyMetadata.hour.description,
    example: propertyMetadata.hour.example,
    name: propertyMetadata.hour.fieldLabels.value,
  })
  hour: number;

  @ApiProperty({
    description: propertyMetadata.opTime.description,
    example: propertyMetadata.opTime.example,
    name: propertyMetadata.opTime.fieldLabels.value,
  })
  opTime?: number;

  @ApiProperty({
    description: propertyMetadata.grossLoadHourly.description,
    example: propertyMetadata.grossLoadHourly.example,
    name: propertyMetadata.grossLoadHourly.fieldLabels.value,
  })
  grossLoad?: number;

  @ApiProperty({
    description: propertyMetadata.steamLoadHourly.description,
    example: propertyMetadata.steamLoadHourly.example,
    name: propertyMetadata.steamLoadHourly.fieldLabels.value,
  })
  steamLoad?: number;

  @ApiProperty({
    description: propertyMetadata.so2MassHourly.description,
    example: propertyMetadata.so2MassHourly.example,
    name: propertyMetadata.so2MassHourly.fieldLabels.value,
  })
  so2Mass?: number;

  @ApiProperty({
    description: propertyMetadata.so2MassMeasureFlg.description,
    example: propertyMetadata.so2MassMeasureFlg.example,
    name: propertyMetadata.so2MassMeasureFlg.fieldLabels.value,
  })
  so2MassMeasureFlg: string;

  @ApiProperty({
    description: propertyMetadata.so2RateMeasureFlg.description,
    example: propertyMetadata.so2RateMeasureFlg.example,
    name: propertyMetadata.so2RateMeasureFlg.fieldLabels.value,
  })
  so2RateMeasureFlg: string;

  @ApiProperty({
    description: propertyMetadata.noxMassHourly.description,
    example: propertyMetadata.noxMassHourly.example,
    name: propertyMetadata.noxMassHourly.fieldLabels.value,
  })
  noxMass?: number;

  @ApiProperty({
    description: propertyMetadata.noxMassMeasureFlg.description,
    example: propertyMetadata.noxMassMeasureFlg.example,
    name: propertyMetadata.noxMassMeasureFlg.fieldLabels.value,
  })
  noxMassMeasureFlg: string;

  @ApiProperty({
    description: propertyMetadata.noxRateMeasureFlg.description,
    example: propertyMetadata.noxRateMeasureFlg.example,
    name: propertyMetadata.noxRateMeasureFlg.fieldLabels.value,
  })
  noxRateMeasureFlg: string;

  @ApiProperty({
    description: propertyMetadata.co2MassMeasureFlg.description,
    example: propertyMetadata.co2MassMeasureFlg.example,
    name: propertyMetadata.co2MassMeasureFlg.fieldLabels.value,
  })
  co2MassMeasureFlg: string;

  @ApiProperty({
    description: propertyMetadata.co2RateMeasureFlg.description,
    example: propertyMetadata.co2RateMeasureFlg.example,
    name: propertyMetadata.co2RateMeasureFlg.fieldLabels.value,
  })
  co2RateMeasureFlg: string;
}
