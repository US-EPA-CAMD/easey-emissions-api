import { Column, ViewEntity } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@ViewEntity({
  name: 'camddmw.vw_hour_unit_data'
})
export class HourUnitDataView {
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
    name: 'op_date',
    type: 'date',
  })
  date: Date;

  @Column({
    name: 'op_hour',
    transformer: new NumericColumnTransformer(),
  })
  hour: number;

  @Column('numeric', {
    name: 'op_time',
    precision: 4,
    scale: 2,
    transformer: new NumericColumnTransformer(),
  })
  opTime: number;

  @Column('numeric', {
    name: 'gload',
    precision: 8,
    scale: 2,
    transformer: new NumericColumnTransformer(),
  })
  grossLoad: number;

  @Column('numeric', {
    name: 'sload',
    precision: 8,
    scale: 2,
    transformer: new NumericColumnTransformer(),
  })
  steamLoad: number;

  @Column('numeric', {
    name: 'so2_mass',
    precision: 15,
    scale: 3,
    transformer: new NumericColumnTransformer(),
  })
  so2Mass: number;

  @Column({ name: 'so2_mass_measure_flg' })
  so2MassMeasureFlg: string;

  @Column('numeric', {
    name: 'so2_rate',
    precision: 15,
    scale: 3,
    transformer: new NumericColumnTransformer(),
  })
  so2Rate: number;

  @Column({ name: 'so2_rate_measure_flg' })
  so2RateMeasureFlg: string;

  @Column('numeric', {
    name: 'co2_mass',
    precision: 15,
    scale: 3,
    transformer: new NumericColumnTransformer(),
  })
  co2Mass: number;

  @Column({ name: 'co2_mass_measure_flg' })
  co2MassMeasureFlg: string;

  @Column('numeric', {
    name: 'co2_rate',
    precision: 15,
    scale: 3,
    transformer: new NumericColumnTransformer(),
  })
  co2Rate: number;

  @Column({ name: 'co2_rate_measure_flg' })
  co2RateMeasureFlg: string;

  @Column('numeric', {
    name: 'nox_mass',
    precision: 15,
    scale: 3,
    transformer: new NumericColumnTransformer(),
  })
  noxMass: number;

  @Column({ name: 'nox_mass_measure_flg' })
  noxMassMeasureFlg: string;

  @Column('numeric', {
    name: 'nox_rate',
    precision: 15,
    scale: 3,
    transformer: new NumericColumnTransformer(),
  })
  noxRate: number;

  @Column({ name: 'nox_rate_measure_flg' })
  noxRateMeasureFlg: string;

  @Column('numeric', {
    name: 'heat_input',
    precision: 15,
    scale: 3,
    transformer: new NumericColumnTransformer(),
  })
  heatInput: number;

  @Column({ name: 'heat_input_measure_flg' })
  heatInputMeasureFlg: string;

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
