import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';

import { MonitorPlan } from './monitor-plan.entity';
import { DailyEmission } from './daily-emission.entity';
import { DailyTestSummary } from './daily-test-summary.entity';
import { HrlyGasFlowMeter } from './hrly-gas-flow-meter.entity';
import { HrlyOpData } from './hrly-op-data.entity';
import { LongTermFuelFlow } from './long-term-fuel-flow.entity';
import { MatsDerivedHrlyValue } from './mats-derived-hrly-value.entity';
import { MatsMonitorHrlyValue } from './mats-monitor-hrly-value.entity';
import { Nsps4tAnnual } from './nsps4t-annual.entity';
import { Nsps4tCompliancePeriod } from './nsps4t-compliance-period.entity';
import { Nsps4tSummary } from './nsps4t-summary.entity';
import { SamplingTrain } from './sampling-train.entity';
import { SorbentTrap } from './sorbent-trap.entity';
import { SummaryValue } from './summary-value.entity';
import { WeeklyTestSummary } from './weekly-test-summary.entity';
import { StackPipe } from './stack-pipe.entity';
import { Unit } from './unit.entity';
import { Component } from './component.entity';
import { MonitorSystem } from './monitor-system.entity';
import { HrlyParamFuelFlow } from './hrly-param-fuel-flow.entity';

@Entity({ name: 'camdecmpswks.monitor_location' })
export class MonitorLocation extends BaseEntity {
  @PrimaryColumn({
    name: 'mon_loc_id',
  })
  id: string;

  @Column({
    name: 'unit_id',
    nullable: true,
  })
  unitId: string;

  @Column({
    name: 'stack_pipe_id',
    nullable: true,
  })
  stackPipeId: string;

  @Column({
    name: 'userid',
    nullable: true,
  })
  userId: string;

  @Column({
    name: 'add_date',
    nullable: true,
    type: 'date',
  })
  addDate: Date;

  @Column({
    name: 'update_date',
    nullable: true,
    type: 'date',
  })
  updateDate: Date;

  @OneToOne(
    () => StackPipe,
    stackPipe => stackPipe.location,
    { eager: true },
  )
  @JoinColumn({ name: 'stack_pipe_id' })
  stackPipe: StackPipe;

  @OneToOne(
    () => Unit,
    unit => unit.monitorLocation,
    { eager: true },
  )
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;

  @ManyToMany(
    () => MonitorPlan,
    plan => plan.locations,
    { eager: true },
  )
  monitorPlans: MonitorPlan[];

  @OneToMany(
    () => DailyEmission,
    c => c.monitorLocation,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  dailyEmissions: DailyEmission[];

  @OneToMany(
    () => DailyEmission,
    c => c.monitorLocation,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  hrlyOpData: HrlyOpData[];

  @OneToMany(
    () => Nsps4tSummary,
    c => c.monitorLocation,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  nsps4tSummaries: Nsps4tSummary[];

  @OneToMany(
    () => SummaryValue,
    c => c.monitorLocation,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  summaryValues: SummaryValue[];

  @OneToMany(
    () => DailyTestSummary,
    c => c.monitorLocation,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  dailyTestSummaries: DailyTestSummary[];

  @OneToMany(
    () => LongTermFuelFlow,
    c => c.monitorLocation,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  longTermFuelFlows: LongTermFuelFlow[];

  @OneToMany(
    () => HrlyGasFlowMeter,
    c => c.monitorLocation,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  hrlyGasFlowMeters: HrlyGasFlowMeter[];

  @OneToMany(
    () => MatsDerivedHrlyValue,
    c => c.monitorLocation,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  matsDerivedHrlyValues: MatsDerivedHrlyValue[];

  @OneToMany(
    () => MatsMonitorHrlyValue,
    c => c.monitorLocation,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  matsMonitorHrlyValues: MatsMonitorHrlyValue[];

  @OneToMany(
    () => Nsps4tAnnual,
    c => c.monitorLocation,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  nsps4tAnnuals: Nsps4tAnnual[];

  @OneToMany(
    () => Nsps4tCompliancePeriod,
    c => c.monitorLocation,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  nsps4tCompliancePeriods: Nsps4tCompliancePeriod[];

  @OneToMany(
    () => SorbentTrap,
    c => c.monitorLocation,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  sorbentTraps: SorbentTrap[];

  @OneToMany(
    () => WeeklyTestSummary,
    c => c.monitorLocation,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  weeklyTestSummaries: WeeklyTestSummary[];

  @OneToMany(
    () => SamplingTrain,
    c => c.monitorLocation,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  samplingTrains: SamplingTrain[];

  @OneToMany(
    () => Component,
    c => c.monitorLocation,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  components: Component[];

  @OneToMany(
    () => MonitorSystem,
    o => o.monitorLocation,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  monitorSystems: MonitorSystem[];

  @OneToMany(
    () => HrlyParamFuelFlow,
    o => o.monitorLocation,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  hrlyParamFuelFlows: HrlyParamFuelFlow[];
}
