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
import { ReportingPeriod } from './reporting-period.entity';

@Entity({ name: 'camdecmpswks.hrly_gas_flow_meter' })
export class HrlyGasFlowMeter extends BaseEntity {
  @PrimaryColumn({ name: 'hrly_gas_flow_meter_id', nullable: false })
  id: string;

  @Column({ nullable: false, name: 'hour_id' })
  hourId: string;

  @Column({ nullable: false, name: 'mon_loc_id' })
  monitoringLocationId: string;

  @Column({
    nullable: false,
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  reportingPeriodId: number;

  @Column({ nullable: false, name: 'component_id' })
  componentId: string;

  @Column({ name: 'begin_end_hour_flg', nullable: true })
  beginEndHourFlag: string;

  @Column({
    name: 'gfm_reading',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  hourlyGfmReading: number;

  @Column({
    name: 'avg_sampling_rate',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  avgHourlySamplingRate: number;

  @Column({ name: 'sampling_rate_uom', nullable: true })
  samplingRateUom: string;

  @Column({
    name: 'flow_to_sampling_ratio',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  hourlySfsrRatio: number;

  @Column({
    name: 'calc_flow_to_sampling_ratio',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcFlowToSamplingRatio: number;

  @Column({
    name: 'calc_flow_to_sampling_mult',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcFlowToSamplingMult: number;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @ManyToOne(
    () => Component,
    o => o.hrlyGasFlowMeters,
  )
  @JoinColumn({ name: 'component_id' })
  component: Component;

  @ManyToOne(
    () => HrlyOpData,
    o => o.hrlyGasFlowMeters,
  )
  @JoinColumn({ name: 'hour_id' })
  hrlyOpData: HrlyOpData;

  @ManyToOne(
    () => MonitorLocation,
    o => o.hrlyGasFlowMeters,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  monitorLocation: MonitorLocation;

  @ManyToOne(
    () => ReportingPeriod,
    o => o.hrlyGasFlowMeters,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  reportingPeriod: ReportingPeriod;
}
