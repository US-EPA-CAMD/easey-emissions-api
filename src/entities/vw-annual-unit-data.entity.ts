import { Column, ViewEntity } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@ViewEntity({
  name: 'camddmw.vw_annual_unit_data'
})
export class AnnualUnitDataView {
  @Column({ name: 'state' })
  stateCode: string;

  @Column({ name: 'facility_name' })
  facilityName: string;

  @Column({
    name: 'orispl_code',
    transformer: new NumericColumnTransformer(),
  })
  facilityId: number;

  @Column({ name: 'unitid' })
  unitId: string;

  @Column({ name: 'assoc_stacks' })
  associatedStacks: string;

  @Column({
    name: 'op_year',
    transformer: new NumericColumnTransformer(),
  })
  year: number;

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

  @Column('numeric', {
    name: 'heat_input',
    precision: 15,
    scale: 3,
    transformer: new NumericColumnTransformer(),
  })
  heatInput: number;

  @Column({ name: 'primary_fuel_info' })
  primaryFuelInfo: string;

  @Column({ name: 'secondary_fuel_info' })
  secondaryFuelInfo: string;

  @Column({ name: 'unit_type_info' })
  unitType: string;

  @Column({ name: 'so2_control_info' })
  so2ControlInfo: string;

  @Column({ name: 'nox_control_info' })
  noxControlInfo: string;

  @Column({ name: 'part_control_info' })
  pmControlInfo: string;

  @Column({ name: 'hg_control_info' })
  hgControlInfo: string;

  @Column({ name: 'prg_code_info' })
  programCodeInfo: string;
}
