import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { MonitorLocation } from './monitor-location.entity';
import { ReportingPeriod } from './reporting-period.entity';
import { DerivedHrlyValue } from './derived-hrly-value.entity';
import { HrlyFuelFlow } from './hrly-fuel-flow.entity';
import { HrlyGasFlowMeter } from './hrly-gas-flow-meter.entity';

@Entity({ name: 'camdecmps.hrly_op_data' })
export class HrlyOpData extends BaseEntity {
  @PrimaryColumn({ name: 'hour_id', nullable: false })
  id: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
    nullable: false,
  })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id', nullable: false })
  monLocId: string;

  @Column({ name: 'begin_date', nullable: false })
  beginDate: Date;

  @Column({
    name: 'begin_hour',
    transformer: new NumericColumnTransformer(),
    nullable: false,
  })
  beginHour: number;

  @Column({
    name: 'op_time',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  opTime: number;

  @Column({
    name: 'hr_load',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  hrLoad: number;

  @Column({
    name: 'load_range',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  loadRange: number;

  @Column({
    name: 'common_stack_load_range',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  commonStackLoadRange: number;

  @Column({
    name: 'fc_factor',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  fcFactor: number;

  @Column({
    name: 'fd_factor',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  fdFactor: number;

  @Column({
    name: 'fw_factor',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  fwFactor: number;

  @Column({ name: 'fuel_cd', nullable: true })
  fuelCd: string;

  @Column({ name: 'multi_fuel_flg', nullable: true })
  multiFuelFlg: string;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @Column({ name: 'load_uom_cd', nullable: true })
  loadUomCd: string;

  @Column({ name: 'operating_condition_cd', nullable: true })
  operatingConditionCd: string;

  @Column({ name: 'fuel_cd_list', nullable: true })
  fuelCdList: string;

  @Column({
    name: 'mhhi_indicator',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  mhhiIndicator: number;

  @Column({
    name: 'mats_load',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  matsLoad: number;

  @Column({ name: 'mats_startup_shutdown_flg', nullable: true })
  matsStartupShutdownFlg: string;

  @ManyToOne(
    () => MonitorLocation,
    o => o.hrlyOpData,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;

  @ManyToOne(
    () => ReportingPeriod,
    o => o.hrlyOpData,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  reportingPeriod: ReportingPeriod;

  @OneToMany(
    () => DerivedHrlyValue,
    c => c.hrlyOpData,
  )
  @JoinColumn({ name: 'hour_id' })
  derivedHrlyValues: DerivedHrlyValue[];

  @OneToMany(
    () => HrlyFuelFlow,
    c => c.hrlyOpData,
  )
  @JoinColumn({ name: 'hour_id' })
  hrlyFuelFlows: HrlyFuelFlow[];

  @OneToMany(
    () => HrlyGasFlowMeter,
    c => c.hrlyOpData,
  )
  @JoinColumn({ name: 'hour_id' })
  hrlyGasFlowMeters: HrlyGasFlowMeter[];
}
