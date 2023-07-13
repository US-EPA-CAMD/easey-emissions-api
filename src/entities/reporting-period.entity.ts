import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { DailyEmission } from './daily-emission.entity';
import { HrlyOpData } from './hrly-op-data.entity';
import { Nsps4tSummary } from './nsps4t-summary.entity';
import { SummaryValue } from './summary-value.entity';
import { DailyTestSummary } from './daily-test-summary.entity';
import { HrlyGasFlowMeter } from './hrly-gas-flow-meter.entity';
import { LongTermFuelFlow } from './long-term-fuel-flow.entity';
import { MatsDerivedHrlyValue } from './mats-derived-hrly-value.entity';
import { MatsMonitorHrlyValue } from './mats-monitor-hrly-value.entity';
import { Nsps4tAnnual } from './nsps4t-annual.entity';
import { Nsps4tCompliancePeriod } from './nsps4t-compliance-period.entity';
import { SorbentTrap } from './sorbent-trap.entity';
import { WeeklyTestSummary } from './weekly-test-summary.entity';
import { SamplingTrain } from './sampling-train.entity';
import { EmissionEvaluation } from './emission-evaluation.entity';
import { DerivedHrlyValue } from './derived-hrly-value.entity';
import { DailyBackstop } from './daily-backstop.entity';

@Entity({ name: 'camdecmpsmd.reporting_period' })
export class ReportingPeriod extends BaseEntity {
  @PrimaryColumn({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  id: number;

  @Column({
    name: 'calendar_year',
    transformer: new NumericColumnTransformer(),
    nullable: false,
  })
  year: number;

  @Column({
    name: 'quarter',
    transformer: new NumericColumnTransformer(),
    nullable: false,
  })
  quarter: number;

  @Column({
    type: 'date',
    name: 'begin_date',
    nullable: false,
  })
  beginDate: Date;

  @Column({
    type: 'date',
    name: 'end_date',
    nullable: false,
  })
  endDate: Date;

  @Column({
    name: 'period_description',
    nullable: false,
  })
  periodDescription: string;

  @Column({
    name: 'period_abbreviation',
    nullable: false,
  })
  periodAbbreviation: string;

  @Column({
    name: 'archive_ind',
    nullable: false,
    transformer: new NumericColumnTransformer(),
  })
  archiveInd: number;

  @OneToMany(
    () => DailyEmission,
    o => o.reportingPeriod,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  dailyEmissions: DailyEmission[];

  @OneToMany(
    () => HrlyOpData,
    o => o.reportingPeriod,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  hrlyOpData: HrlyOpData[];

  @OneToMany(
    () => Nsps4tSummary,
    o => o.reportingPeriod,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  nsps4tSummaries: Nsps4tSummary[];

  @OneToMany(
    () => SummaryValue,
    o => o.reportingPeriod,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  summaryValues: SummaryValue[];

  @OneToMany(
    () => SummaryValue,
    c => c.monitorLocation,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  derivedHrlyValues: DerivedHrlyValue[];

  @OneToMany(
    () => DailyTestSummary,
    o => o.reportingPeriod,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  dailyTestSummaries: DailyTestSummary[];

  @OneToMany(
    () => HrlyGasFlowMeter,
    o => o.reportingPeriod,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  hrlyGasFlowMeters: HrlyGasFlowMeter[];

  @OneToMany(
    () => LongTermFuelFlow,
    o => o.reportingPeriod,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  longTermFuelFlows: LongTermFuelFlow[];

  @OneToMany(
    () => MatsDerivedHrlyValue,
    o => o.reportingPeriod,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  matsDerivedHrlyValues: MatsDerivedHrlyValue[];

  @OneToMany(
    () => MatsMonitorHrlyValue,
    o => o.reportingPeriod,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  matsMonitorHrlyValues: MatsMonitorHrlyValue[];

  @OneToMany(
    () => Nsps4tAnnual,
    o => o.reportingPeriod,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  nsps4tAnnuals: Nsps4tAnnual[];

  @OneToMany(
    () => Nsps4tCompliancePeriod,
    o => o.reportingPeriod,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  nsps4tCompliancePeriods: Nsps4tCompliancePeriod[];

  @OneToMany(
    () => SorbentTrap,
    o => o.reportingPeriod,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  sorbentTraps: SorbentTrap[];

  @OneToMany(
    () => WeeklyTestSummary,
    o => o.reportingPeriod,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  weeklyTestSummaries: WeeklyTestSummary[];

  @OneToMany(
    () => SamplingTrain,
    o => o.reportingPeriod,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  samplingTrains: SamplingTrain[];

  @OneToMany(
    () => EmissionEvaluation,
    o => o.reportingPeriod,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  emissionEvaluations: EmissionEvaluation[];

  @OneToMany(
    () => DailyBackstop,
    o => o.reportingPeriod,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  dailyBackstops: DailyBackstop[];

}
