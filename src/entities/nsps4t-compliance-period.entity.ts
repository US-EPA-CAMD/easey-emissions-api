import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.nsps4t_compliance_period' })
export class Nsps4tCompliancePeriod extends BaseEntity {
  @PrimaryColumn({ name: 'nsps4t_cmp_id', nullable: false })
  nsps4tCmpId: string;

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
  avgCo2EmissionRate: number;

  @Column({ name: 'co2_emission_rate_uom_cd', nullable: true })
  co2EmissionRateUomCd: string;

  @Column({
    name: 'pct_valid_op_hours',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  pctValidOpHours: number;

  @Column({
    name: 'co2_violation_ind',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  co2ViolationInd: number;

  @Column({ name: 'co2_violation_comment', nullable: true })
  co2ViolationComment: string;

  @Column({ nullable: false, name: 'mon_loc_id' })
  monLocId: string;

  @Column({
    nullable: false,
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  rptPeriodId: number;

  @Column({ nullable: false, name: 'userid' })
  userId: string;

  @Column({ nullable: false, name: 'add_date' })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;
}
