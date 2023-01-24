import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camddmw.annual_unit_data' })
export class AnnualUnitData extends BaseEntity {
  @PrimaryColumn({
    name: 'unit_id',
    transformer: new NumericColumnTransformer(),
  })
  id: number;

  @PrimaryColumn({
    name: 'op_year',
    transformer: new NumericColumnTransformer(),
  })
  year: number;
}
