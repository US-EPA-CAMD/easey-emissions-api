import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { MonitorLocation } from './monitor-location.entity';
import { ReportingPeriod } from './reporting-period.entity';

@Entity({ name: 'camdecmps.nsps4t_summary' })
export class Nsps4tSummary extends BaseEntity {
  @PrimaryColumn({ name: 'nsps4t_sum_id', nullable: false })
  id: string;

  @Column({ name: 'emission_standard_cd', nullable: true })
  emissionStandardCd: string;

  @Column({
    name: 'modus_value',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  modusValue: number;

  @Column({ name: 'modus_uom_cd', nullable: true })
  modusUomCd: string;

  @Column({ name: 'electrical_load_cd', nullable: true })
  electricalLoadCd: string;

  @Column({
    name: 'no_period_ended_ind',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  noPeriodEndedInd: number;

  @Column({ name: 'no_period_ended_comment', nullable: true })
  noPeriodEndedComment: string;

  @Column({ name: 'mon_loc_id', nullable: false })
  monLocId: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
    nullable: false,
  })
  rptPeriodId: number;

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
  location: MonitorLocation;
  
  @ManyToOne(
    () => ReportingPeriod,
    o => o.nsps4tSummaries,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  reportingPeriod: ReportingPeriod;



}
