import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { MonitorLocation } from './monitor-location.entity';
import { MonitorSystem } from './monitor-system.entity';
import { ReportingPeriod } from './reporting-period.entity';
import { Component } from './component.entity';
import { WeeklySystemIntegrity } from './weekly-system-integrity.entity';

@Entity({ name: 'camdecmps.weekly_test_summary' })
export class WeeklyTestSummary extends BaseEntity {
  @PrimaryColumn({ name: 'weekly_test_sum_id', nullable: false })
  id: string;

  @Column({
    nullable: false,
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  rptPeriodId: number;

  @Column({ nullable: false, name: 'mon_loc_id' })
  monLocId: string;

  @Column({ name: 'mon_sys_id', nullable: true })
  monSysId: string;

  @Column({ name: 'component_id', nullable: true })
  componentId: string;

  @Column({ nullable: false, name: 'test_date' })
  testDate: Date;

  @Column({
    nullable: false,
    name: 'test_hour',
    transformer: new NumericColumnTransformer(),
  })
  testHour: number;

  @Column({
    name: 'test_min',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  testMin: number;

  @Column({ nullable: false, name: 'test_type_cd' })
  testTypeCode: string;

  @Column({ nullable: false, name: 'test_result_cd' })
  testResultCode: string;

  @Column({ nullable: false, name: 'span_scale_cd' })
  spanScaleCode: string;

  @Column({ name: 'calc_test_result_cd', nullable: true })
  calcTestResultCode: string;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @ManyToOne(
    () => Component,
    o => o.weeklyTestSummaries,
  )
  @JoinColumn({ name: 'component_id' })
  component: Component;

  @ManyToOne(
    () => MonitorLocation,
    o => o.weeklyTestSummaries,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;

  @ManyToOne(
    () => MonitorSystem,
    o => o.weeklyTestSummaries,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  system: MonitorSystem;

  @ManyToOne(
    () => ReportingPeriod,
    o => o.weeklyTestSummaries,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  reportingPeriod: ReportingPeriod;

  @OneToOne(
    () => WeeklySystemIntegrity,
    o => o.weeklyTestSumId,
  )
  @JoinColumn({ name: 'weekly_test_sum_id' })
  weeklySystemIntegrity: WeeklySystemIntegrity;
}
