import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  State,
  UnitType,
  UnitFuelType,
  ControlTechnology,
  Program,
} from '@us-epa-camd/easey-common/enums';
import { IsOrisCode } from '@us-epa-camd/easey-common/pipes';
import {
  propertyMetadata,
  ErrorMessages,
} from '@us-epa-camd/easey-common/constants';

import { IsUnitType } from '../pipes/is-unit-type.pipe';
import { IsStateCode } from '../pipes/is-state-code.pipe';
import { IsUnitFuelType } from '../pipes/is-unit-fuel-type.pipe';
import { IsControlTechnology } from '../pipes/is-control-technology.pipe';
import { IsEmissionsProgram } from '../pipes/is-emissions-program.pipe';

export class MatsApportionedEmissionsParamsDTO {
  @ApiHideProperty()
  currentDate: Date = this.getCurrentDate;

  @ApiProperty({
    enum: State,
    description: propertyMetadata.stateCode.description,
  })
  @IsOptional()
  @IsStateCode({
    each: true,
    message: ErrorMessages.UnitCharacteristics(true, 'stateCode'),
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  stateCode?: State[];

  @ApiProperty({
    isArray: true,
    description: propertyMetadata.facilityId.description,
  })
  @IsOptional()
  @IsOrisCode({
    each: true,
    message: ErrorMessages.UnitCharacteristics(true, 'facilityId'),
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  facilityId?: number[];

  @ApiProperty({
    enum: UnitType,
    description: propertyMetadata.unitType.description,
  })
  @IsOptional()
  @IsUnitType({
    each: true,
    message: ErrorMessages.UnitCharacteristics(true, 'unitType'),
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  unitType?: UnitType[];

  @ApiProperty({
    enum: UnitFuelType,
    description: propertyMetadata.unitFuelType.description,
  })
  @IsOptional()
  @IsUnitFuelType({
    each: true,
    message: ErrorMessages.UnitCharacteristics(true, 'unitFuelType'),
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  unitFuelType?: UnitFuelType[];

  @ApiProperty({
    enum: ControlTechnology,
    description: propertyMetadata.controlTechnologies.description,
  })
  @IsOptional()
  @IsControlTechnology({
    each: true,
    message: ErrorMessages.UnitCharacteristics(true, 'controlTechnologies'),
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  controlTechnologies?: ControlTechnology[];

  private get getCurrentDate(): Date {
    return new Date();
  }
}

export class ApportionedEmissionsParamsDTO extends MatsApportionedEmissionsParamsDTO {
  @ApiProperty({
    enum: Program,
    description: propertyMetadata.programCodeInfo.description,
  })
  @IsOptional()
  @IsEmissionsProgram({
    each: true,
    message:
      ErrorMessages.UnitCharacteristics(true, 'programCodeInfo') +
      '?emissionsUIFilter=true',
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  programCodeInfo?: Program[];
}
