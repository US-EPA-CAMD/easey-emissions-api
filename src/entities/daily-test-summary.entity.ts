import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.daily_test_summary' })
export class DailyTestSummary extends BaseEntity {
  @PrimaryColumn({ name: 'daily_test_sum_id', nullable: false })
  dailyTestSumId: string;

  @Column({
    nullable: false,
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id', nullable: false })
  monLocId: string;

  @Column({ name: 'component_id', nullable: true })
  componentId: string;

  @Column({ nullable: false, name: 'daily_test_date' })
  dailyTestDate: Date;

  @Column({
    nullable: false,
    name: 'daily_test_hour',
    transformer: new NumericColumnTransformer(),
  })
  dailyTestHour: number;

  @Column({
    name: 'daily_test_min',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  dailyTestMin: number;

  @Column({ nullable: false, name: 'test_type_cd' })
  testTypeCd: string;

  @Column({ nullable: false, name: 'test_result_cd' })
  testResultCd: string;

  @Column({ nullable: false, name: 'calc_test_result_cd' })
  calcTestResultCd: string;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @Column({ nullable: false, name: 'span_scale_cd' })
  spanScaleCd: string;

  @Column({ nullable: false, name: 'mon_sys_id' })
  monSysId: string;
}
