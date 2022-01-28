import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { OzoneUnitData } from '../entities/ozone-unit-data.entity';
import { AnnualApportionedEmissionsMap } from './annual-apportioned-emissions.map';
import { OzoneApportionedEmissionsDTO } from '../dto/ozone-apportioned-emissions.dto';

@Injectable()
export class OzoneApportionedEmissionsMap extends BaseMap<OzoneUnitData, OzoneApportionedEmissionsDTO> {
  constructor(private readonly annualApportionedEmissionsMap: AnnualApportionedEmissionsMap) { super(); }

  public async one(entity: OzoneUnitData): Promise<OzoneApportionedEmissionsDTO> {
    return {
      ...await this.annualApportionedEmissionsMap.one(entity),
    };
  }
}
