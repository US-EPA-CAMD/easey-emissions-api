import { Column, ViewEntity } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@ViewEntity({
  name: 'camddmw.vw_ozone_unit_data',
})
export class OzoneUnitDataView {
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

  @Column({ name: 'unit_id' })
  unit_id: string;

  @Column({ name: 'unitid' })
  unitId: string;

  @Column({ name: 'assoc_stacks' })
  associatedStacks: string;

  @Column({
    name: 'op_year',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  year: number;

  @Column({
    name: 'count_op_time',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  countOpTime: number;

  @Column({
    name: 'sum_op_time',
    precision: 10,
    scale: 2,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  sumOpTime: number;

  @Column({
    name: 'gload',
    precision: 12,
    scale: 2,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  grossLoad: number;

  @Column({
    name: 'sload',
    precision: 12,
    scale: 2,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  steamLoad: number;

  @Column({
    name: 'so2_mass',
    precision: 12,
    scale: 3,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  so2Mass: number;

  @Column({
    name: 'so2_rate',
    precision: 16,
    scale: 4,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  so2Rate: number;

  @Column({
    name: 'co2_mass',
    precision: 12,
    scale: 3,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  co2Mass: number;

  @Column({
    name: 'co2_rate',
    precision: 16,
    scale: 4,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  co2Rate: number;

  @Column({
    name: 'nox_mass',
    precision: 12,
    scale: 3,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  noxMass: number;

  @Column({
    name: 'nox_rate',
    precision: 16,
    scale: 4,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  noxRate: number;

  @Column({
    name: 'heat_input',
    precision: 15,
    scale: 3,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
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
