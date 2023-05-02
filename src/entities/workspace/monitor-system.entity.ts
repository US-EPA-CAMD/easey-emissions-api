import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { DailyTestSummary } from './daily-test-summary.entity';
import { DerivedHrlyValue } from './derived-hrly-value.entity';
import { HrlyFuelFlow } from './hrly-fuel-flow.entity';
import { LongTermFuelFlow } from './long-term-fuel-flow.entity';
import { MatsMonitorHrlyValue } from './mats-monitor-hrly-value.entity';
import { MonitorHrlyValue } from './monitor-hrly-value.entity';
import { SorbentTrap } from './sorbent-trap.entity';
import { WeeklyTestSummary } from './weekly-test-summary.entity';
import { HrlyParamFuelFlow } from './hrly-param-fuel-flow.entity';
import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmpswks.monitor_system' })
export class MonitorSystem extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'mon_sys_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  monitoringLocationId: string;

  @Column({ type: 'varchar', length: 7, nullable: true, name: 'sys_type_cd' })
  systemTypeCode: string;

  @Column({
    type: 'varchar',
    length: 3,
    nullable: true,
    name: 'system_identifier',
  })
  monitoringSystemId: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: false,
    name: 'sys_designation_cd',
  })
  systemDesignationCode: string;

  @Column({ type: 'varchar', length: 7, nullable: false, name: 'fuel_cd' })
  fuelCode: string;

  @Column({ type: 'date', nullable: false, name: 'begin_date' })
  beginDate: Date;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({ name: 'begin_hour', transformer: new NumericColumnTransformer() })
  beginHour: number;

  @Column({
    name: 'end_hour',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  endHour: number;

  @Column({ type: 'varchar', nullable: true, length: 25, name: 'userid' })
  userId: string;

  @Column({ nullable: true, name: 'add_date' })
  addDate: Date;

  @Column({ nullable: true, name: 'update_date' })
  updateDate: Date;

  @OneToMany(
    () => DailyTestSummary,
    c => c.monitorSystem,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  dailyTestSummaries: DailyTestSummary[];

  @OneToMany(
    () => DerivedHrlyValue,
    c => c.monitorSystem,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  derivedHrlyValues: DerivedHrlyValue[];

  @OneToMany(
    () => HrlyFuelFlow,
    c => c.monitorSystem,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  hrlyFuelFlows: HrlyFuelFlow[];

  @OneToMany(
    () => LongTermFuelFlow,
    c => c.monitorSystem,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  longTermFuelFlows: LongTermFuelFlow[];

  @OneToMany(
    () => MatsMonitorHrlyValue,
    c => c.monitorSystem,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  matsMonitorHrlyValues: MatsMonitorHrlyValue[];

  @OneToMany(
    () => MonitorHrlyValue,
    c => c.monitorSystem,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  monitorHrlyValues: MonitorHrlyValue[];

  @OneToMany(
    () => SorbentTrap,
    c => c.monitorSystem,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  sorbentTraps: SorbentTrap[];

  @OneToMany(
    () => WeeklyTestSummary,
    c => c.monitorSystem,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  weeklyTestSummaries: WeeklyTestSummary[];

  @OneToMany(
    () => HrlyParamFuelFlow,
    c => c.monitorSystem,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  hrlyParamFuelFlows: HrlyParamFuelFlow[];

  @ManyToOne(
    () => MonitorLocation,
    o => o.monitorSystems,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  monitorLocation: MonitorLocation;
}
