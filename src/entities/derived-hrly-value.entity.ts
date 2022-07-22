import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

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

  @Column({ name: 'unadjusted_hrly_value' })
  unadjustedHrlyValue: number | null;

  @Column({ name: 'applicable_bias_adj_factor' })
  applicableBiasAdjFactor: number | null;

  @Column({ name: 'calc_unadjusted_hrly_value' })
  calcUnadjustedHrlyValue: number | null;

  @Column({ name: 'adjusted_hrly_value' })
  adjustedHrlyValue: number | null;

  @Column({ name: 'calc_adjusted_hrly_value' })
  calcAdjustedHrlyValue: number | null;

  @Column({ name: 'modc_cd' })
  modcCd: string | null;

  @Column({ name: 'operating_condition_cd' })
  operatingConditionCd: string | null;

  @Column({ name: 'pct_available' })
  pctAvailable: number | null;

  @Column({ name: 'diluent_cap_ind' })
  diluentCapInd: number | null;

  @Column({ name: 'segment_num' })
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

  @Column({ name: 'calc_fuel_flow_total' })
  calcFuelFlowTotal: number | null;

  @Column({ name: 'calc_hour_measure_cd' })
  calcHourMeasureCd: string | null;
}
