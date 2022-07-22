import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmps.mats_monitor_hrly_value' })
export class MatsMonitorHrlyValue extends BaseEntity {
  @PrimaryColumn({ name: 'mats_mhv_id' })
  matsMhvId: string;

  @Column({ name: 'hour_id' })
  hourId: string;

  @Column({ name: 'mon_loc_id' })
  monLocId: string;

  @Column({ name: 'rpt_period_id' })
  rptPeriodId: number;

  @Column({ name: 'parameter_cd' })
  parameterCd: string;

  @Column({ name: 'mon_sys_id' })
  monSysId: string | null;

  @Column({ name: 'component_id' })
  componentId: string | null;

  @Column({ name: 'unadjusted_hrly_value' })
  unadjustedHrlyValue: string | null;

  @Column({ name: 'modc_cd' })
  modcCd: string | null;

  @Column({ name: 'pct_available' })
  pctAvailable: number | null;

  @Column({ name: 'calc_unadjusted_hrly_value' })
  calcUnadjustedHrlyValue: string | null;

  @Column({ name: 'calc_daily_cal_status' })
  calcDailyCalStatus: string | null;

  @Column({ name: 'calc_hg_line_status' })
  calcHgLineStatus: string | null;

  @Column({ name: 'calc_hgi1_status' })
  calcHgi1Status: string | null;

  @Column({ name: 'calc_rata_status' })
  calcRataStatus: string | null;

  @Column({ name: 'userid' })
  userId: string | null;

  @Column({ name: 'add_date' })
  addDate: Date | null;

  @Column({ name: 'update_date' })
  updateDate: Date | null;
}
