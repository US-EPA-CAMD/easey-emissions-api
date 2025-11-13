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
    type: 'numeric',
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
    type: 'numeric',
  })
  hour: number;

  @Column({
    name: 'op_time',
    precision: 3,
    scale: 2,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  opTime: number;

  @Column({
    name: 'gload',
    precision: 8,
    scale: 2,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  matsGrossLoad: number;

  @Column({
    name: 'heat_input',
    precision: 15,
    scale: 3,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  matsHeatInput: number;

  @Column({
    name: 'hg_rate_eo',
    precision: 22,
    scale: 10,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  hgOutputRate: number;

  @Column({
    name: 'hg_rate_hi',
    precision: 22,
    scale: 10,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  hgInputRate: number;

  @Column({
    name: 'hg_mass',
    precision: 22,
    scale: 10,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  hgMass: number;

  @Column({ name: 'hg_measure_flg' })
  hgMassMeasureFlg: string;

  @Column({
    name: 'hcl_rate_eo',
    precision: 22,
    scale: 10,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  hclOutputRate: number;

  @Column({
    name: 'hcl_rate_hi',
    precision: 22,
    scale: 10,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  hclInputRate: number;

  @Column({
    name: 'hcl_mass',
    precision: 22,
    scale: 10,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  hclMass: number;

  @Column({ name: 'hcl_measure_flg' })
  hclMassMeasureFlg: string;

  @Column({
    name: 'hf_rate_eo',
    precision: 22,
    scale: 10,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  hfOutputRate: number;

  @Column({
    name: 'hf_rate_hi',
    precision: 22,
    scale: 10,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  hfInputRate: number;

  @Column({
    name: 'hf_mass',
    precision: 22,
    scale: 10,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  hfMass: number;

  @Column({ name: 'hf_measure_flg' })
  hfMassMeasureFlg: string;

  @Column({ name: 'assoc_stacks' })
  associatedStacks: string;

  @Column({
    name: 'sload',
    precision: 8,
    scale: 2,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
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
