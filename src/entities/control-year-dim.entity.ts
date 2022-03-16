import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camddmw.control_year_dim' })
export class ControlYearDim extends BaseEntity {
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

  @PrimaryColumn({
    name: 'control_year_id',
    transformer: new NumericColumnTransformer(),
  })
  controlYrId: number;

  @PrimaryColumn({
    name: 'control_code',
  })
  controlCode: string;

  @PrimaryColumn({
    name: 'parameter',
  })
  parameter: string;
}
