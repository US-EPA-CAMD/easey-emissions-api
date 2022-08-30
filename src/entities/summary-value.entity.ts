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
import { ReportingPeriod } from './reporting-period.entity';

@Entity({ name: 'camdecmps.summary_value' })
export class SummaryValue extends BaseEntity {
  @PrimaryColumn({
    name: 'sum_value_id',
    nullable: false,
  })
  id: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
    nullable: false,
  })
  reportingPeriodId: number;

  @Column({ name: 'mon_loc_id', nullable: false })
  monitoringLocationId: string;

  @Column({ name: 'parameter_cd', nullable: false })
  parameterCode: string;

  @Column({
    name: 'current_rpt_period_total',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  currentReportingPeriodTotal: number;

  @Column({
    name: 'calc_current_rpt_period_total',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcCurrentRptPeriodTotal: number;

  @Column({
    name: 'os_total',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  ozoneSeasonToDateTotal: number;

  @Column({
    name: 'calc_os_total',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcOsTotal: number;

  @Column({
    name: 'year_total',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  yearToDateTotal: number;

  @Column({
    name: 'calc_year_total',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcYearTotal: number;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @ManyToOne(
    () => MonitorLocation,
    o => o.summaryValues,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  monitorLocation: MonitorLocation;

  @ManyToOne(
    () => ReportingPeriod,
    o => o.summaryValues,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  reportingPeriod: ReportingPeriod;
}
