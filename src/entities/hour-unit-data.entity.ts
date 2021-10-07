import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { UnitFact } from './unit-fact.entity';

@Entity({ name: 'camddmw.hour_unit_data' })
export class HourUnitData extends BaseEntity {
  @PrimaryColumn({
    name: 'unit_id',
  })
  id: number;

  @PrimaryColumn({
    name: 'op_date',
  })
  date: Date;

  @PrimaryColumn({
    name: 'op_hour',
  })
  hour: number;

  @Column({
    name: 'op_year',
  })
  year: number;

  @Column({
    name: 'op_time',
  })
  opTime: number;

  @Column({
    name: 'gload',
  })
  grossLoad: number;

  @Column({
    name: 'sload',
  })
  steamLoad: number;

  @Column({
    name: 'heat_input',
  })
  heatInput: number;

  @Column({
    name: 'so2_mass',
  })
  so2Mass: number;

  @Column({
    name: 'so2_mass_measure_flg',
  })
  so2MassMeasureFlg: string;

  @Column({
    name: 'so2_rate',
  })
  so2Rate: number;

  @Column({
    name: 'so2_rate_measure_flg',
  })
  so2RateMeasureFlg: string;

  @Column({
    name: 'co2_mass',
  })
  co2Mass: number;

  @Column({
    name: 'co2_mass_measure_flg',
  })
  co2MassMeasureFlg: string;

  @Column({
    name: 'co2_rate',
  })
  co2Rate: number;

  @Column({
    name: 'co2_rate_measure_flg',
  })
  co2RateMeasureFlg: string;

  @Column({
    name: 'nox_mass',
  })
  noxMass: number;

  @Column({
    name: 'nox_mass_measure_flg',
  })
  noxMassMeasureFlg: string;

  @Column({
    name: 'nox_rate',
  })
  noxRate: number;

  @Column({
    name: 'nox_rate_measure_flg',
  })
  noxRateMeasureFlg: string;

  @ManyToOne(
    () => UnitFact,
    uf => uf.hourUnitData,
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
