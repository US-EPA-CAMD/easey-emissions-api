import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { UnitFact } from './unit-fact.entity';

@Entity({ name: 'camddmw.ozone_unit_data' })
export class OzoneUnitData extends BaseEntity {
  @PrimaryColumn({
    name: 'unit_id',
  })
  unitId: number;

  @PrimaryColumn({
    name: 'op_year',
  })
  opYear: number;

  @Column({
    name: 'heat_input',
  })
  heatInput: number;

  @Column({
    name: 'nox_mass',
  })
  noxMass: number;

  @Column({
    name: 'nox_rate',
  })
  noxRate: number;

  @Column({
    name: 'co2_mass',
  })
  co2Mass: number;

  @Column({
    name: 'co2_rate',
  })
  co2Rate: number;

  @Column({
    name: 'so2_mass',
  })
  so2Mass: number;

  @Column({
    name: 'so2_rate',
  })
  so2Rate: number;

  @Column()
  sload: number;

  @Column()
  gload: number;

  @Column({
    name: 'sum_op_time',
  })
  sumOpTime: number;

  @Column({
    name: 'count_op_time',
  })
  countOpTime: number;

  @ManyToOne(
    () => UnitFact,
    uf => uf.ozoneUnitData,
  )
  @JoinColumn([
    {
      name: 'unit_id',
      referencedColumnName: 'id',
    },
    {
      name: 'op_year',
      referencedColumnName: 'opYear',
    },
  ])
  unitFact: UnitFact;
}
