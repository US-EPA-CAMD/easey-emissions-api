import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { Component } from './component.entity';
import { HrlyOpData } from './hrly-op-data.entity';
import { MonitorLocation } from './monitor-location.entity';
import { MonitorSystem } from './monitor-system.entity';
import { ReportingPeriod } from './reporting-period.entity';

@Entity({ name: 'camdecmps.mats_monitor_hrly_value' })
export class MatsMonitorHrlyValue extends BaseEntity {
  @PrimaryColumn({ name: 'mats_mhv_id', nullable: false })
  id: string;

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
  parameterCode: string;

  @Column({ name: 'mon_sys_id', nullable: true })
  monitoringSystemId: string;

  @Column({ name: 'component_id', nullable: true })
  componentId: string;

  @Column({ name: 'unadjusted_hrly_value', nullable: true })
  unadjustedHourlyValue: string;

  @Column({ name: 'modc_cd', nullable: true })
  modcCode: string;

  @Column({
    name: 'pct_available',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  percentAvailable: number;

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

  @ManyToOne(
    () => Component,
    o => o.matsMonitorHrlyValues,
  )
  @JoinColumn({ name: 'component_id' })
  component: Component;

  @ManyToOne(
    () => HrlyOpData,
    o => o.matsMonitorHourlyValueData,
  )
  @JoinColumn({ name: 'hour_id' })
  hrlyOpData: HrlyOpData;

  @ManyToOne(
    () => MonitorLocation,
    o => o.matsMonitorHrlyValues,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;

  @ManyToOne(
    () => MonitorSystem,
    o => o.matsMonitorHrlyValues,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  system: MonitorSystem;

  @ManyToOne(
    () => ReportingPeriod,
    o => o.matsMonitorHrlyValues,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  reportingPeriod: ReportingPeriod;
}
