import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmps.summary_value' })
export class SummaryValue extends BaseEntity {
  @PrimaryColumn({
    name: 'sum_value_id',
    nullable: false,
  })
  sumValueId: string;

  @Column({ name: 'rpt_period_id', nullable: false })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id', nullable: false })
  monLocId: string;

  @Column({ name: 'parameter_cd', nullable: false })
  parameterCd: string;

  @Column({ name: 'current_rpt_period_total', nullable: true })
  currentRptPeriodTotal: number;

  @Column({ name: 'calc_current_rpt_period_total', nullable: true })
  calcCurrentRptPeriodTotal: number;

  @Column({ name: 'os_total', nullable: true })
  osTotal: number;

  @Column({ name: 'calc_os_total', nullable: true })
  calcOsTotal: number;

  @Column({ name: 'year_total', nullable: true })
  yearTotal: number;

  @Column({ name: 'calc_year_total', nullable: true })
  calcYearTotal: number;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;
}
