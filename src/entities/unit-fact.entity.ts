import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { HourUnitData } from './hour-unit-data.entity';
import { DayUnitData } from './day-unit-data.entity';
import { MonthUnitData } from './month-unit-data.entity';
import { QuarterUnitData } from './quarter-unit-data.entity';
import { AnnualUnitData } from './annual-unit-data.entity';
import { OzoneUnitData } from './ozone-unit-data.entity';

@Entity({ name: 'camddmw.unit_fact' })
export class UnitFact extends BaseEntity {
  @PrimaryColumn({
    name: 'unit_id',
  })
  id: number;

  @PrimaryColumn({
    name: 'op_year',
  })
  year: number;

  @Column({
    name: 'facility_name',
  })
  facilityName: string;

  @Column({
    name: 'orispl_code',
  })
  facilityId: number;

  @Column({
    name: 'unitid',
  })
  unitId: string;

  @Column({
    name: 'state',
  })
  state: string;

  @Column({
    name: 'primary_fuel_info',
  })
  primaryFuelInfo: string;

  @Column({
    name: 'secondary_fuel_info',
  })
  secondaryFuelInfo: string;

  @Column({
    name: 'unit_type_info',
  })
  unitType: string;

  @Column({
    name: 'so2_control_info',
  })
  so2ControlInfo: string;

  @Column({
    name: 'nox_control_info',
  })
  noxControlInfo: string;

  @Column({
    name: 'part_control_info',
  })
  pmControlInfo: string;

  @Column({
    name: 'hg_control_info',
  })
  hgControlInfo: string;

  @Column({
    name: 'prg_code_info',
  })
  programCodeInfo: string;

  @Column({
    name: 'assoc_stacks',
  })
  associatedStacks: string;

  @OneToMany(
    () => HourUnitData,
    hrUnit => hrUnit.unitFact,
  )
  hourUnitData: HourUnitData[];

  @OneToMany(
    () => DayUnitData,
    dayUnit => dayUnit.unitFact,
  )
  dayUnitData: DayUnitData[];

  @OneToMany(
    () => MonthUnitData,
    monthUnit => monthUnit.unitFact,
  )
  monthUnitData: MonthUnitData[];

  @OneToMany(
    () => QuarterUnitData,
    quarterUnit => quarterUnit.unitFact,
  )
  quarterUnitData: QuarterUnitData[];

  @OneToMany(
    () => AnnualUnitData,
    annualUnit => annualUnit.unitFact,
  )
  annualUnitData: AnnualUnitData[];

  @OneToMany(
    () => OzoneUnitData,
    ozoneUnit => ozoneUnit.unitFact,
  )
  ozoneUnitData: OzoneUnitData[];
}
