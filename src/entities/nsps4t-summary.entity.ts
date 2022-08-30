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
import { ReportingPeriod } from './reporting-period.entity';
import { Nsps4tAnnual } from './nsps4t-annual.entity';
import { Nsps4tCompliancePeriod } from './nsps4t-compliance-period.entity';

@Entity({ name: 'camdecmps.nsps4t_summary' })
export class Nsps4tSummary extends BaseEntity {
  @PrimaryColumn({ name: 'nsps4t_sum_id', nullable: false })
  id: string;

  @Column({ name: 'emission_standard_cd', nullable: true })
  co2EmissionStandardCode: string;

  @Column({
    name: 'modus_value',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  modusValue: number;

  @Column({ name: 'modus_uom_cd', nullable: true })
  modusUomCode: string;

  @Column({ name: 'electrical_load_cd', nullable: true })
  electricalLoadCode: string;

  @Column({
    name: 'no_period_ended_ind',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  noCompliancePeriodEndedIndicator: number;

  @Column({ name: 'no_period_ended_comment', nullable: true })
  noCompliancePeriodEndedComment: string;

  @Column({ name: 'mon_loc_id', nullable: false })
  monitoringLocationId: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
    nullable: false,
  })
  reportingPeriodId: number;

  @Column({ name: 'userid', nullable: false })
  userId: string;

  @Column({ name: 'add_date', nullable: false })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @ManyToOne(
    () => MonitorLocation,
    o => o.nsps4tSummaries,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  monitorLocation: MonitorLocation;

  @ManyToOne(
    () => ReportingPeriod,
    o => o.nsps4tSummaries,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  reportingPeriod: ReportingPeriod;

  // @TODO: Verify this relationship type once there is data in nsps4t-annual and nsps4t-summary tables
  @OneToOne(
    () => Nsps4tAnnual,
    o => o.nsps4tSummary,
  )
  @JoinColumn({ name: 'nsps4t_sum_id' })
  nsps4tAnnual: Nsps4tAnnual;

  // @TODO: Verify this relationship type once there is data in nsps4t-compliance-period and nsps4t-summary tables
  @OneToOne(
    () => Nsps4tCompliancePeriod,
    o => o.nsps4tSummary,
  )
  @JoinColumn({ name: 'nsps4t_sum_id' })
  nsps4tCompliancePeriod: Nsps4tCompliancePeriod;
}
