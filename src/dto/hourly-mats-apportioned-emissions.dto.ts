import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import { UnitFactDTO } from './unit-fact.dto';

export class HourlyMatsApportionedEmissionsDTO extends UnitFactDTO {
  constructor() {
    super();
  }

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
  hour?: number;

  @ApiProperty({
    description: propertyMetadata.opTime.description,
    example: propertyMetadata.opTime.example,
    name: propertyMetadata.opTime.fieldLabels.value,
  })
  opTime?: number;

  @ApiProperty({
    description: propertyMetadata.matsGrossLoad.description,
    example: propertyMetadata.matsGrossLoad.example,
    name: propertyMetadata.matsGrossLoad.fieldLabels.value,
  })
  matsGrossLoad?: number;

  @ApiProperty({
    description: propertyMetadata.matsHeatInput.description,
    example: propertyMetadata.matsHeatInput.example,
    name: propertyMetadata.matsHeatInput.fieldLabels.value,
  })
  matsHeatInput?: number;

  @ApiProperty({
    description: propertyMetadata.hgOutputRate.description,
    example: propertyMetadata.hgOutputRate.example,
    name: propertyMetadata.hgOutputRate.fieldLabels.value,
  })
  hgOutputRate?: number;

  @ApiProperty({
    description: propertyMetadata.hgInputRate.description,
    example: propertyMetadata.hgInputRate.example,
    name: propertyMetadata.hgInputRate.fieldLabels.value,
  })
  hgInputRate?: number;

  @ApiProperty({
    description: propertyMetadata.hgMass.description,
    example: propertyMetadata.hgMass.example,
    name: propertyMetadata.hgMass.fieldLabels.value,
  })
  hgMass?: number;

  @ApiProperty({
    description: propertyMetadata.hgMassMeasureFlg.description,
    example: propertyMetadata.hgMassMeasureFlg.example,
    name: propertyMetadata.hgMassMeasureFlg.fieldLabels.value,
  })
  hgMassMeasureFlg: string;

  @ApiProperty({
    description: propertyMetadata.hclOutputRate.description,
    example: propertyMetadata.hclOutputRate.example,
    name: propertyMetadata.hclOutputRate.fieldLabels.value,
  })
  hclOutputRate?: number;

  @ApiProperty({
    description: propertyMetadata.hclInputRate.description,
    example: propertyMetadata.hclInputRate.example,
    name: propertyMetadata.hclInputRate.fieldLabels.value,
  })
  hclInputRate?: number;

  @ApiProperty({
    description: propertyMetadata.hclMass.description,
    example: propertyMetadata.hclMass.example,
    name: propertyMetadata.hclMass.fieldLabels.value,
  })
  hclMass?: number;

  @ApiProperty({
    description: propertyMetadata.hclMassMeasureFlg.description,
    example: propertyMetadata.hclMassMeasureFlg.example,
    name: propertyMetadata.hclMassMeasureFlg.fieldLabels.value,
  })
  hclMassMeasureFlg: string;

  @ApiProperty({
    description: propertyMetadata.hfOutputRate.description,
    name: propertyMetadata.hfOutputRate.fieldLabels.value,
  })
  hfOutputRate?: number;

  @ApiProperty({
    description: propertyMetadata.hfInputRate.description,
    name: propertyMetadata.hfInputRate.fieldLabels.value,
  })
  hfInputRate?: number;

  @ApiProperty({
    description: propertyMetadata.hfMass.description,
    name: propertyMetadata.hfMass.fieldLabels.value,
  })
  hfMass?: number;

  @ApiProperty({
    description: propertyMetadata.hfMassMeasureFlg.description,
    name: propertyMetadata.hfMassMeasureFlg.fieldLabels.value,
  })
  hfMassMeasureFlg: string;

  @ApiProperty({
    description: propertyMetadata.steamLoadHourly.description,
    example: propertyMetadata.steamLoadHourly.example,
    name: propertyMetadata.steamLoadHourly.fieldLabels.value,
  })
  steamLoad?: number;
}
