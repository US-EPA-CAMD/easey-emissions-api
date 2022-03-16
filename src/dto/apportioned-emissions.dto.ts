import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import { UnitFactDTO } from '../dto/unit-fact.dto';

export class ApportionedEmissionsDTO extends UnitFactDTO {
  constructor() {
    super();
  }
  @ApiProperty({
    description: propertyMetadata.programCodeInfo.description,
    example: propertyMetadata.programCodeInfo.example,
    name: propertyMetadata.programCodeInfo.fieldLabels.value,
  })
  programCodeInfo: string;

  @ApiProperty({
    description: propertyMetadata.grossLoad.description,
    example: propertyMetadata.grossLoad.example,
    name: propertyMetadata.grossLoad.fieldLabels.value,
  })
  grossLoad?: number;

  @ApiProperty({
    description: propertyMetadata.steamLoad.description,
    example: propertyMetadata.steamLoad.example,
    name: propertyMetadata.steamLoad.fieldLabels.value,
  })
  steamLoad?: number;

  @ApiProperty({
    description: propertyMetadata.so2Mass.description,
    example: propertyMetadata.so2Mass.example,
    name: propertyMetadata.so2Mass.fieldLabels.value,
  })
  so2Mass?: number;

  @ApiProperty({
    description: propertyMetadata.so2Rate.description,
    example: propertyMetadata.so2Rate.example,
    name: propertyMetadata.so2Rate.fieldLabels.value,
  })
  so2Rate?: number;

  @ApiProperty({
    description: propertyMetadata.noxMass.description,
    example: propertyMetadata.noxMass.example,
    name: propertyMetadata.noxMass.fieldLabels.value,
  })
  noxMass?: number;

  @ApiProperty({
    description: propertyMetadata.noxRate.description,
    example: propertyMetadata.noxRate.example,
    name: propertyMetadata.noxRate.fieldLabels.value,
  })
  noxRate?: number;

  @ApiProperty({
    description: propertyMetadata.co2Mass.description,
    example: propertyMetadata.co2Mass.example,
    name: propertyMetadata.co2Mass.fieldLabels.value,
  })
  co2Mass?: number;

  @ApiProperty({
    description: propertyMetadata.co2Rate.description,
    example: propertyMetadata.co2Rate.example,
    name: propertyMetadata.co2Rate.fieldLabels.value,
  })
  co2Rate?: number;

  @ApiProperty({
    description: propertyMetadata.heatInput.description,
    example: propertyMetadata.heatInput.example,
    name: propertyMetadata.heatInput.fieldLabels.value,
  })
  heatInput?: number;
}
