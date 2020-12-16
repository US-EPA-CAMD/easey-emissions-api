import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { UnitFact } from './unit-fact.entity';

@Entity({ name: 'camddmw.hour_unit_data' })
export class HourUnitData extends BaseEntity {
  @PrimaryColumn({
    name: 'unit_id',
  })
  unitId: number;

  @PrimaryColumn({
    name: 'op_date',
  })
  opDate: Date;

  @PrimaryColumn({
    name: 'op_hour',
  })
  opHour: number;

  @Column({
    name: 'op_time',
  })
  opTime: number;

  @Column()
  gload: number;

  @Column()
  sload: number;

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

  @ManyToOne(() => UnitFact, uf => uf.hourUnitData)
  unitFact: UnitFact;
}
