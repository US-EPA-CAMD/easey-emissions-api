import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camddmw.fuel_year_dim' })
export class FuelYearDim extends BaseEntity {
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
    name: 'fuel_yr_dim',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  fuelYrDim: number;

  @Column({
    name: 'fuel_code',
  })
  fuelTypeCode: string;
}
