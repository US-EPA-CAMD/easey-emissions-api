import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { MonitorLocation } from './monitor-location.entity';
import { Nsps4tSummary } from './nsps4t-summary.entity';
import { ReportingPeriod } from './reporting-period.entity';

@Entity({ name: 'camdecmpswks.nsps4t_compliance_period' })
export class Nsps4tCompliancePeriod extends BaseEntity {
  @PrimaryColumn({ name: 'nsps4t_cmp_id', nullable: false })
  id: string;

  @Column({ name: 'nsps4t_sum_id', nullable: false })
  nsps4tSumId: string;

  @Column({
    name: 'begin_year',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  beginYear: number;

  @Column({
    name: 'begin_month',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  beginMonth: number;

  @Column({
    name: 'end_year',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  endYear: number;

  @Column({
    name: 'end_month',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  endMonth: number;

  @Column({
    name: 'avg_co2_emission_rate',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  averageCo2EmissionRate: number;

  @Column({ name: 'co2_emission_rate_uom_cd', nullable: true })
  co2EmissionRateUomCode: string;

  @Column({
    name: 'pct_valid_op_hours',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  percentValidOpHours: number;

  @Column({
    name: 'co2_violation_ind',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  violationOfCo2StandardIndicator: number;

  @Column({ name: 'co2_violation_comment', nullable: true })
  violationOfCo2StandardComment: string;

  @Column({ nullable: false, name: 'mon_loc_id' })
  monitoringLocationId: string;

  @Column({
    nullable: false,
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  reportingPeriodId: number;

  @Column({ nullable: false, name: 'userid' })
  userId: string;

  @Column({ nullable: false, name: 'add_date' })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @ManyToOne(
    () => MonitorLocation,
    o => o.nsps4tCompliancePeriods,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  monitorLocation: MonitorLocation;

  @ManyToOne(
    () => ReportingPeriod,
    o => o.nsps4tCompliancePeriods,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  reportingPeriod: ReportingPeriod;

  @ManyToOne(
    () => Nsps4tSummary,
    o => o.nsps4tCompliancePeriodData,
  )
  @JoinColumn({ name: 'nsps4t_sum_id' })
  nsps4tSummary: Nsps4tSummary;
}
