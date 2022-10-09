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
import { Nsps4tSummary } from './nsps4t-summary.entity';

@Entity({ name: 'camdecmps.nsps4t_annual' })
export class Nsps4tAnnual extends BaseEntity {
  @PrimaryColumn({ name: 'nsps4t_ann_id', nullable: false })
  id: string;

  @Column({ name: 'nsps4t_sum_id', nullable: false })
  nsps4tSumId: string;

  @Column({
    name: 'annual_energy_sold',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  annualEnergySold: number;

  @Column({ name: 'annual_energy_sold_type_cd', nullable: true })
  annualEnergySoldTypeCode: string;

  @Column({
    name: 'annual_potential_output',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  annualPotentialElectricOutput: number;

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
    o => o.nsps4tAnnuals,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  monitorLocation: MonitorLocation;

  @ManyToOne(
    () => ReportingPeriod,
    o => o.nsps4tAnnuals,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  reportingPeriod: ReportingPeriod;

  @ManyToOne(
    () => Nsps4tSummary,
    o => o.nsps4tAnnualData,
  )
  @JoinColumn({ name: 'nsps4t_sum_id' })
  nsps4tSummary: Nsps4tSummary;
}
