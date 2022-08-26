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
import { MonitorSystem } from './monitor-system.entity';
import { HrlyOpData } from './hrly-op-data.entity';

@Entity({ name: 'camdecmps.monitor_hrly_value' })
export class MonitorHrlyValue extends BaseEntity {
  @PrimaryColumn({ name: 'monitor_hrly_val_id', nullable: false })
  id: string;

  @Column({ name: 'hour_id', nullable: false })
  hourId: string;

  @Column({ name: 'mon_sys_id', nullable: true })
  monitoringSystemId: string;

  @Column({ name: 'component_id', nullable: true })
  componentId: string;

  @Column({ name: 'parameter_cd', nullable: false })
  parameterCode: string;

  @Column({
    name: 'applicable_bias_adj_factor',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  biasAdjustmentFactor: number;

  @Column({
    name: 'unadjusted_hrly_value',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  unadjustedHourlyValue: number;

  @Column({
    name: 'adjusted_hrly_value',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  adjustedHourlyValue: number;

  @Column({
    name: 'calc_adjusted_hrly_value',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcAdjustedHrlyValue: number;

  @Column({ name: 'modc_cd', nullable: true })
  modcCode: string;

  @Column({
    name: 'pct_available',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  percentAvailable: number;

  @Column({ name: 'moisture_basis', nullable: true })
  moistureBasis: string;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @Column({ name: 'calc_line_status', nullable: true })
  calcLineStatus: string;

  @Column({ name: 'calc_rata_status', nullable: true })
  calcRataStatus: string;

  @Column({ name: 'calc_daycal_status', nullable: true })
  calcDaycalStatus: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
    nullable: false,
  })
  reportingPeriodId: number;

  @Column({ name: 'mon_loc_id', nullable: false })
  monitoringLocationId: string;

  @Column({ name: 'calc_leak_status', nullable: true })
  calcLeakStatus: string;

  @Column({ name: 'calc_dayint_status', nullable: true })
  calcDayintStatus: string;

  @Column({ name: 'calc_f2l_status', nullable: true })
  calcF2lStatus: string;

  @ManyToOne(
    () => Component,
    o => o.monitorHrlyValues,
  )
  @JoinColumn({ name: 'component_id' })
  component: Component;

  @ManyToOne(
    () => MonitorSystem,
    o => o.monitorHrlyValues,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  monitorSystem: MonitorSystem;

  @ManyToOne(
    () => HrlyOpData,
    o => o.monitorHourlyValues,
  )
  @JoinColumn({ name: 'hour_id' })
  hrlyOpData: HrlyOpData;
}
