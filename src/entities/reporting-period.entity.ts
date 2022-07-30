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
  hrlyOpData: DailyEmission[];

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
}
