import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { WeeklyTestSummary } from './weekly-test-summary.entity';

@Entity({ name: 'camdecmps.weekly_system_integrity' })
export class WeeklySystemIntegrity extends BaseEntity {
  @PrimaryColumn({
    name: 'weekly_sys_integrity_id',
    nullable: false,
  })
  id: string;

  @Column({ name: 'weekly_test_sum_id', nullable: false })
  weeklyTestSumId: string;

  @Column({ name: 'gas_level_cd', nullable: true })
  gasLevelCode: string;

  @Column({
    name: 'ref_value',
    nullable: true,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  referenceValue: number;

  @Column({
    name: 'measured_value',
    nullable: true,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  measuredValue: number;

  @Column({
    name: 'system_integrity_error',
    nullable: true,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  systemIntegrityError: number;

  @Column({
    name: 'aps_ind',
    nullable: true,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  apsIndicator: number;

  @Column({
    name: 'calc_system_integrity_error',
    nullable: true,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calcSystemIntegrityError: number;

  @Column({
    name: 'calc_aps_ind',
    nullable: true,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calcApsInd: number;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @Column({
    name: 'rpt_period_id',
    nullable: false,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  reportingPeriodId: number;

  @Column({ name: 'mon_loc_id', nullable: false })
  monitoringLocationId: string;

  @OneToOne(
    () => WeeklyTestSummary,
    o => o.weeklySystemIntegrity,
  )
  @JoinColumn({ name: 'weekly_test_sum_id' })
  weeklyTestSummary: WeeklyTestSummary;
}
