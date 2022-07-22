import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmps.nsps4t_compliance_period' })
export class Nsps4tCompliancePeriod extends BaseEntity {
  @PrimaryColumn({ name: 'nsps4t_cmp_id' })
  nsps4tCmpId: string;

  @Column({ name: 'nsps4t_sum_id' })
  nsps4tSumId: string;

  @Column({ name: 'begin_year' })
  beginYear: number | null;

  @Column({ name: 'begin_month' })
  beginMonth: number | null;

  @Column({ name: 'end_year' })
  endYear: number | null;

  @Column({ name: 'end_month' })
  endMonth: number | null;

  @Column({ name: 'avg_co2_emission_rate' })
  avgCo2EmissionRate: number | null;

  @Column({ name: 'co2_emission_rate_uom_cd' })
  co2EmissionRateUomCd: string | null;

  @Column({ name: 'pct_valid_op_hours' })
  pctValidOpHours: number | null;

  @Column({ name: 'co2_violation_ind' })
  co2ViolationInd: number | null;

  @Column({ name: 'co2_violation_comment' })
  co2ViolationComment: string | null;

  @Column({ name: 'mon_loc_id' })
  monLocId: string;

  @Column({ name: 'rpt_period_id' })
  rptPeriodId: number;

  @Column({ name: 'userid' })
  userId: string;

  @Column({ name: 'add_date' })
  addDate: Date;

  @Column({ name: 'update_date' })
  updateDate: Date | null;
}
