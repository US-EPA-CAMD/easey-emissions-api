import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { HourUnitMatsData } from './hour-unit-mats-data.entity';
import { HourUnitMatsDataArch } from './hour-unit-mats-data-arch.entity';

@Entity({ name: 'camddmw.unit_fact' })
export class UnitFact extends BaseEntity {
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

  @Column({
    name: 'orispl_code',
    transformer: new NumericColumnTransformer(),
  })
  facilityId: number;

  @Column({
    name: 'facility_name',
  })
  facilityName: string;

  @Column({ name: 'state' })
  stateCode: string;

  @Column({
    name: 'unitid',
  })
  unitId: string;

  @Column({
    name: 'assoc_stacks',
  })
  associatedStacks: string;

  @Column({
    name: 'prg_code_info',
  })
  programCodeInfo: string;

  @Column({
    name: 'epa_region',
    transformer: new NumericColumnTransformer(),
  })
  epaRegion: number;

  @Column({
    name: 'nerc_region',
  })
  nercRegion: string;

  @Column()
  county: string;

  @Column({
    name: 'county_code',
  })
  countyCode: string;

  @Column({
    name: 'fips_code',
  })
  fipsCode: string;

  @Column({
    name: 'source_cat',
  })
  sourceCategory: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column({
    name: 'so2_phase',
  })
  so2Phase: string;

  @Column({
    name: 'nox_phase',
  })
  noxPhase: string;

  @Column({
    name: 'unit_type_info',
  })
  unitType: string;

  @Column({
    name: 'primary_fuel_info',
  })
  primaryFuelInfo: string;

  @Column({
    name: 'secondary_fuel_info',
  })
  secondaryFuelInfo: string;

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
    name: 'comr_op_date',
  })
  commercialOperationDate: Date;

  @Column({
    name: 'op_status_info',
  })
  operatingStatus: string;

  @Column({
    name: 'capacity_input',
    transformer: new NumericColumnTransformer(),
  })
  maxHourlyHIRate: number;

  @OneToMany(
    () => HourUnitMatsData,
    humd => humd.unitFact,
  )
  hourUnitMatsData: HourUnitMatsData[];

  @OneToMany(
    () => HourUnitMatsDataArch,
    humd => humd.unitFact,
  )
  hourUnitMatsDataArch: HourUnitMatsDataArch[];
}
