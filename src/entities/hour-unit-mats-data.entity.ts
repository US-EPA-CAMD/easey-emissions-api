import {
  Column,
  ViewEntity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { UnitFact } from './unit-fact.entity';

@ViewEntity({
  name: 'camddmw.hour_unit_mats_data',
})
export class HourUnitMatsData {
  @PrimaryColumn({
    name: 'unit_id',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  id: number;

  @PrimaryColumn({
    name: 'op_date',
  })
  date: Date;

  @PrimaryColumn({
    name: 'op_hour',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  hour: number;

  @Column({
    name: 'op_year',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  year: number;

  @ManyToOne(
    () => UnitFact,
    uf => uf.hourUnitMatsDataArch,
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
