import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.nsps4t_compliance_period' })
export class Nsps4tCompliancePeriod extends BaseEntity {
  @PrimaryColumn({ name: 'nsps4t_cmp_id' })
  nsps4tCmpId: string;

  @Column({ name: 'nsps4t_sum_id' })
  nsps4tSumId: string;

  @Column({ name: 'begin_year', transformer: new NumericColumnTransformer() })
  beginYear: number | null;

  @Column({ name: 'begin_month', transformer: new NumericColumnTransformer() })
  beginMonth: number | null;

  @Column({ name: 'end_year', transformer: new NumericColumnTransformer() })
  endYear: number | null;

  @Column({ name: 'end_month', transformer: new NumericColumnTransformer() })
  endMonth: number | null;

  @Column({
    name: 'avg_co2_emission_rate',
    transformer: new NumericColumnTransformer(),
  })
  avgCo2EmissionRate: number | null;

  @Column({ name: 'co2_emission_rate_uom_cd' })
  co2EmissionRateUomCd: string | null;

  @Column({
    name: 'pct_valid_op_hours',
    transformer: new NumericColumnTransformer(),
  })
  pctValidOpHours: number | null;

  @Column({
    name: 'co2_violation_ind',
    transformer: new NumericColumnTransformer(),
  })
  co2ViolationInd: number | null;

  @Column({ name: 'co2_violation_comment' })
  co2ViolationComment: string | null;

  @Column({ name: 'mon_loc_id' })
  monLocId: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  rptPeriodId: number;

  @Column({ name: 'userid' })
  userId: string;

  @Column({ name: 'add_date' })
  addDate: Date;

  @Column({ name: 'update_date' })
  updateDate: Date | null;
}
