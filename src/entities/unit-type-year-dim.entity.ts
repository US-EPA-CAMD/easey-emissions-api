import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camddmw.unit_type_year_dim' })
export class UnitTypeYearDim extends BaseEntity {
  @PrimaryColumn({
    name: 'unit_id',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  id: number;

  @PrimaryColumn({
    name: 'op_year',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  year: number;

  @PrimaryColumn({
    name: 'unit_type',
  })
  unitTypeCode: string;
}
