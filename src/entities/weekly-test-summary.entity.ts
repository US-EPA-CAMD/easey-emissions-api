import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.weekly_test_summary' })
export class WeeklyTestSummary extends BaseEntity {
  @PrimaryColumn({ name: 'weekly_test_sum_id', nullable: false })
  weeklyTestSumId: string;

  @Column({
    nullable: false,
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  rptPeriodId: number;

  @Column({ nullable: false, name: 'mon_loc_id' })
  monLocId: string;

  @Column({ name: 'mon_sys_id', nullable: true })
  monSysId: string;

  @Column({ name: 'component_id', nullable: true })
  componentId: string;

  @Column({ nullable: false, name: 'test_date' })
  testDate: Date;

  @Column({
    nullable: false,
    name: 'test_hour',
    transformer: new NumericColumnTransformer(),
  })
  testHour: number;

  @Column({
    name: 'test_min',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  testMin: number;

  @Column({ nullable: false, name: 'test_type_cd' })
  testTypeCd: string;

  @Column({ nullable: false, name: 'test_result_cd' })
  testResultCd: string;

  @Column({ nullable: false, name: 'span_scale_cd' })
  spanScaleCd: string;

  @Column({ name: 'calc_test_result_cd', nullable: true })
  calcTestResultCd: string;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;
}
