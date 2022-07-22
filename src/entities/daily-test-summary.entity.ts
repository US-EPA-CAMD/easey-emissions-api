import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.daily_test_summary' })
export class DailyTestSummary extends BaseEntity {
  @PrimaryColumn({ name: 'daily_test_sum_id' })
  dailyTestSumId: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id' })
  monLocId: string;

  @Column({ name: 'component_id' })
  componentId: string | null;

  @Column({ name: 'daily_test_date' })
  dailyTestDate: Date;

  @Column({
    name: 'daily_test_hour',
    transformer: new NumericColumnTransformer(),
  })
  dailyTestHour: number;

  @Column({
    name: 'daily_test_min',
    transformer: new NumericColumnTransformer(),
  })
  dailyTestMin: number | null;

  @Column({ name: 'test_type_cd' })
  testTypeCd: string;

  @Column({ name: 'test_result_cd' })
  testResultCd: string;

  @Column({ name: 'calc_test_result_cd' })
  calcTestResultCd: string;

  @Column({ name: 'userid' })
  userId: string | null;

  @Column({ name: 'add_date' })
  addDate: Date | null;

  @Column({ name: 'update_date' })
  updateDate: Date | null;

  @Column({ name: 'span_scale_cd' })
  spanScaleCd: string;

  @Column({ name: 'mon_sys_id' })
  monSysId: string;
}
