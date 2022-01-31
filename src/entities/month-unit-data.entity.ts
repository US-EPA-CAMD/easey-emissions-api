import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { UnitFact } from './unit-fact.entity';

@Entity({ name: 'camddmw.month_unit_data' })
export class MonthUnitData extends BaseEntity {
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
    name: 'op_month',
    transformer: new NumericColumnTransformer(),
  })
  month: number;

  @Column({
    name: 'count_op_time',
    transformer: new NumericColumnTransformer(),    
  })
  countOpTime: number;

  @Column('numeric', {
    name: 'sum_op_time',
    precision: 10,
    scale: 2,
    transformer: new NumericColumnTransformer(),
  })
  sumOpTime: number;

  @Column('numeric', {
    name: 'gload',
    precision: 12,
    scale: 2,
    transformer: new NumericColumnTransformer(),
  })
  grossLoad: number;

  @Column('numeric', {
    name: 'sload',
    precision: 12,
    scale: 2,
    transformer: new NumericColumnTransformer(),
  })
  steamLoad: number;

  @Column('numeric', {
    name: 'heat_input',
    precision: 15,
    scale: 3,
    transformer: new NumericColumnTransformer(),
  })
  heatInput: number;

  @Column('numeric', {
    name: 'so2_mass',
    precision: 12,
    scale: 3,
    transformer: new NumericColumnTransformer(),
  })
  so2Mass: number;

  @Column('numeric', {
    name: 'so2_rate',
    precision: 16,
    scale: 4,
    transformer: new NumericColumnTransformer(),
  })
  so2Rate: number;

  @Column('numeric', {
    name: 'co2_mass',
    precision: 12,
    scale: 3,
    transformer: new NumericColumnTransformer(),
  })
  co2Mass: number;

  @Column('numeric', {
    name: 'co2_rate',
    precision: 16,
    scale: 4,
    transformer: new NumericColumnTransformer(),
  })
  co2Rate: number;

  @Column('numeric', {
    name: 'nox_mass',
    precision: 12,
    scale: 3,
    transformer: new NumericColumnTransformer(),
  })
  noxMass: number;

  @Column('numeric', {
    name: 'nox_rate',
    precision: 16,
    scale: 4,
    transformer: new NumericColumnTransformer(),
  })
  noxRate: number;

  @ManyToOne(
    () => UnitFact,
    uf => uf.monthUnitData,
  )
  @JoinColumn([
    {
      name: 'unit_id',
      referencedColumnName: 'id',
    },
    {
      name: 'op_year',
      referencedColumnName: 'year',
    },
  ])
  unitFact: UnitFact;
}
