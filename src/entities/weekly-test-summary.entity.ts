import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmps.weekly_test_summary' })
export class WeeklyTestSummary extends BaseEntity {
  @PrimaryColumn({ name: 'weekly_test_sum_id' })
  weeklyTestSumId: string;

  @Column({ name: 'rpt_period_id' })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id' })
  monLocId: string;

  @Column({ name: 'mon_sys_id' })
  monSysId: string | null;

  @Column({ name: 'component_id' })
  componentId: string | null;

  @Column({ name: 'test_date' })
  testDate: Date;

  @Column({ name: 'test_hour' })
  testHour: number;

  @Column({ name: 'test_min' })
  testMin: number | null;

  @Column({ name: 'test_type_cd' })
  testTypeCd: string;

  @Column({ name: 'test_result_cd' })
  testResultCd: string;

  @Column({ name: 'span_scale_cd' })
  spanScaleCd: string;

  @Column({ name: 'calc_test_result_cd' })
  calcTestResultCd: string | null;

  @Column({ name: 'userid' })
  userId: string | null;

  @Column({ name: 'add_date' })
  addDate: Date | null;

  @Column({ name: 'update_date' })
  updateDate: Date | null;
}
