import { Column, ViewEntity } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@ViewEntity({
  name: 'camddmw.vw_hour_unit_mats_data',
})
export class HourUnitMatsDataView {
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
    precision: 3,
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
  matsGrossLoad: number;

  @Column('numeric', {
    name: 'heat_input',
    precision: 15,
    scale: 3,
    transformer: new NumericColumnTransformer(),
  })
  matsHeatInput: number;

  @Column({
    name: 'hg_rate_eo',
    precision: 22,
    scale: 10,
    transformer: new NumericColumnTransformer(),
  })
  hgOutputRate: number;

  @Column({
    name: 'hg_rate_hi',
    precision: 22,
    scale: 10,
    transformer: new NumericColumnTransformer(),
  })
  hgInputRate: number;

  @Column({
    name: 'hg_mass',
    precision: 22,
    scale: 10,
    transformer: new NumericColumnTransformer(),
  })
  hgMass: number;

  @Column({ name: 'hg_measure_flg' })
  hgMassMeasureFlg: string;

  @Column({
    name: 'hcl_rate_eo',
    precision: 22,
    scale: 10,
    transformer: new NumericColumnTransformer(),
  })
  hclOutputRate: number;

  @Column({
    name: 'hcl_rate_hi',
    precision: 22,
    scale: 10,
    transformer: new NumericColumnTransformer(),
  })
  hclInputRate: number;

  @Column({
    name: 'hcl_mass',
    precision: 22,
    scale: 10,
    transformer: new NumericColumnTransformer(),
  })
  hclMass: number;

  @Column({ name: 'hcl_measure_flg' })
  hclMassMeasureFlg: string;

  @Column({
    name: 'hf_rate_eo',
    precision: 22,
    scale: 10,
    transformer: new NumericColumnTransformer(),
  })
  hfOutputRate: number;

  @Column({
    name: 'hf_rate_hi',
    precision: 22,
    scale: 10,
    transformer: new NumericColumnTransformer(),
  })
  hfInputRate: number;

  @Column({
    name: 'hf_mass',
    precision: 22,
    scale: 10,
    transformer: new NumericColumnTransformer(),
  })
  hfMass: number;

  @Column({ name: 'hf_measure_flg' })
  hfMassMeasureFlg: string;

  @Column({ name: 'assoc_stacks' })
  associatedStacks: string;

  @Column('numeric', {
    name: 'sload',
    precision: 8,
    scale: 2,
    transformer: new NumericColumnTransformer(),
  })
  steamLoad: number;

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
}
