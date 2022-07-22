import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmps.monitor-hrly-value.entity' })
export class MonitorHrlyValue extends BaseEntity {
  @PrimaryColumn({ name: 'monitor_hrly_val_id' })
  monitorHrlyValId: string;

  @Column({ name: 'hour_id' })
  hourId: string;

  @Column({ name: 'mon_sys_id' })
  monSysId: string | null;

  @Column({ name: 'component_id' })
  componentId: string | null;

  @Column({ name: 'parameter_cd' })
  parameterCd: string;

  @Column({ name: 'applicable_bias_adj_factor' })
  applicableBiasAdjFactor: number | null;

  @Column({ name: 'unadjusted_hrly_value' })
  unadjustedHrlyValue: number | null;

  @Column({ name: 'adjusted_hrly_value' })
  adjustedHrlyValue: number | null;

  @Column({ name: 'calc_adjusted_hrly_value' })
  calcAdjustedHrlyValue: number | null;

  @Column({ name: 'modc_cd' })
  modcCd: string | null;

  @Column({ name: 'pct_available' })
  pctAvailable: number | null;

  @Column({ name: 'moisture_basis' })
  moistureBasis: string | null;

  @Column({ name: 'userid' })
  userId: string | null;

  @Column({ name: 'add_date' })
  addDate: Date | null;

  @Column({ name: 'update_date' })
  updateDate: Date | null;

  @Column({ name: 'calc_line_status' })
  calcLineStatus: string | null;

  @Column({ name: 'calc_rata_status' })
  calcRataStatus: string | null;

  @Column({ name: 'calc_daycal_status' })
  calcDaycalStatus: string | null;

  @Column({ name: 'rpt_period_id' })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id' })
  monLocId: string;

  @Column({ name: 'calc_leak_status' })
  calcLeakStatus: string | null;

  @Column({ name: 'calc_dayint_status' })
  calcDayintStatus: string | null;

  @Column({ name: 'calc_f2l_status' })
  calcF2lStatus: string | null;
}
