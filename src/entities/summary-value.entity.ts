import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmps.summary_value' })
export class SummaryValue extends BaseEntity {
  @PrimaryColumn({
    name: 'sum_value_id',
  })
  sumValueId: string;

  @Column({ name: 'rpt_period_id' })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id' })
  monLocId: string;

  @Column({ name: 'parameter_cd' })
  parameterCd: string;

  @Column({ name: 'current_rpt_period_total' })
  currentRptPeriodTotal: number | null;

  @Column({ name: 'calc_current_rpt_period_total' })
  calcCurrentRptPeriodTotal: number | null;

  @Column({ name: 'os_total' })
  osTotal: number | null;

  @Column({ name: 'calc_os_total' })
  calcOsTotal: number | null;

  @Column({ name: 'year_total' })
  yearTotal: number | null;

  @Column({ name: 'calc_year_total' })
  calcYearTotal: number | null;

  @Column({ name: 'userid' })
  userId: string | null;

  @Column({ name: 'add_date' })
  addDate: Date | null;

  @Column({ name: 'update_date' })
  updateDate: Date | null;
}
