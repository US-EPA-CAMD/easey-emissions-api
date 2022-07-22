import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.derived_hrly_value' })
export class DerivedHrlyValue extends BaseEntity {
  @PrimaryColumn({ name: 'derv_id' })
  dervId: string;

  @Column({ name: 'hour_id' })
  hourId: string;

  @Column({ name: 'mon_sys_id' })
  monSysId: string | null;

  @Column({ name: 'mon_form_id' })
  monFormId: string | null;

  @Column({ name: 'parameter_cd' })
  parameterCd: string;

  @Column({
    name: 'unadjusted_hrly_value',
    transformer: new NumericColumnTransformer(),
  })
  unadjustedHrlyValue: number | null;

  @Column({
    name: 'applicable_bias_adj_factor',
    transformer: new NumericColumnTransformer(),
  })
  applicableBiasAdjFactor: number | null;

  @Column({
    name: 'calc_unadjusted_hrly_value',
    transformer: new NumericColumnTransformer(),
  })
  calcUnadjustedHrlyValue: number | null;

  @Column({
    name: 'adjusted_hrly_value',
    transformer: new NumericColumnTransformer(),
  })
  adjustedHrlyValue: number | null;

  @Column({
    name: 'calc_adjusted_hrly_value',
    transformer: new NumericColumnTransformer(),
  })
  calcAdjustedHrlyValue: number | null;

  @Column({ name: 'modc_cd' })
  modcCd: string | null;

  @Column({ name: 'operating_condition_cd' })
  operatingConditionCd: string | null;

  @Column({
    name: 'pct_available',
    transformer: new NumericColumnTransformer(),
  })
  pctAvailable: number | null;

  @Column({
    name: 'diluent_cap_ind',
    transformer: new NumericColumnTransformer(),
  })
  diluentCapInd: number | null;

  @Column({ name: 'segment_num', transformer: new NumericColumnTransformer() })
  segmentNum: number | null;

  @Column({ name: 'fuel_cd' })
  fuelCd: string | null;

  @Column({ name: 'userid' })
  userId: string | null;

  @Column({ name: 'add_date' })
  addDate: Date | null;

  @Column({ name: 'update_date' })
  updateDate: Date | null;

  @Column({ name: 'calc_pct_diluent' })
  calcPctDiluent: string | null;

  @Column({ name: 'calc_pct_moisture' })
  calcPctMoisture: string | null;

  @Column({ name: 'calc_rata_status' })
  calcRataStatus: string | null;

  @Column({ name: 'calc_appe_status' })
  calcAppeStatus: string | null;

  @Column({ name: 'rpt_period_id' })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id' })
  monLocId: string;

  @Column({
    name: 'calc_fuel_flow_total',
    transformer: new NumericColumnTransformer(),
  })
  calcFuelFlowTotal: number | null;

  @Column({ name: 'calc_hour_measure_cd' })
  calcHourMeasureCd: string | null;
}
