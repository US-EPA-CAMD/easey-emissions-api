import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'weekly_system_integrity' })
export class WeeklySystemIntegrity extends BaseEntity {
  @PrimaryColumn({ name: 'weekly_sys_integrity_id', nullable: false })
  weeklySysIntegrityId: string;

  @Column({ name: 'weekly_test_sum_id', nullable: false })
  weeklyTestSumId: string;

  @Column({ name: 'gas_level_cd', nullable: true })
  gasLevelCd: string;

  @Column({
    name: 'ref_value',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  refValue: number;

  @Column({
    name: 'measured_value',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  measuredValue: number;

  @Column({
    name: 'system_integrity_error',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  systemIntegrityError: number;

  @Column({
    name: 'aps_ind',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  apsInd: number;

  @Column({
    name: 'calc_system_integrity_error',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  calcSystemIntegrityError: number;

  @Column({
    name: 'calc_aps_ind',
    nullable: true,
    transformer: new NumericColumnTransformer(),
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
  })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id', nullable: false })
  monLocId: string;
}
