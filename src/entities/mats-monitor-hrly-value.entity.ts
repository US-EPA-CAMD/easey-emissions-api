import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.mats_monitor_hrly_value' })
export class MatsMonitorHrlyValue extends BaseEntity {
  @PrimaryColumn({ name: 'mats_mhv_id', nullable: false })
  matsMhvId: string;

  @Column({ nullable: false, name: 'hour_id' })
  hourId: string;

  @Column({ nullable: false, name: 'mon_loc_id' })
  monLocId: string;

  @Column({
    nullable: false,
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  rptPeriodId: number;

  @Column({ name: 'parameter_cd', nullable: false })
  parameterCd: string;

  @Column({ name: 'mon_sys_id', nullable: true })
  monSysId: string;

  @Column({ name: 'component_id', nullable: true })
  componentId: string;

  @Column({ name: 'unadjusted_hrly_value', nullable: true })
  unadjustedHrlyValue: string;

  @Column({ name: 'modc_cd', nullable: true })
  modcCd: string;

  @Column({
    name: 'pct_available',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  pctAvailable: number;

  @Column({ name: 'calc_unadjusted_hrly_value', nullable: true })
  calcUnadjustedHrlyValue: string;

  @Column({ name: 'calc_daily_cal_status', nullable: true })
  calcDailyCalStatus: string;

  @Column({ name: 'calc_hg_line_status', nullable: true })
  calcHgLineStatus: string;

  @Column({ name: 'calc_hgi1_status', nullable: true })
  calcHgi1Status: string;

  @Column({ name: 'calc_rata_status', nullable: true })
  calcRataStatus: string;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;
}
