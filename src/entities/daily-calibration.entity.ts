import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { DailyTestSummary } from './daily-test-summary.entity';

@Entity({ name: 'camdecmps.daily_calibration' })
export class DailyCalibration extends BaseEntity {
  @PrimaryColumn({
    name: 'cal_inj_id',
    type: 'varchar',
    length: 45,
    nullable: false,
  })
  id: string;

  @Column({
    name: 'daily_test_sum_id',
    type: 'varchar',
    length: 45,
    nullable: false,
  })
  dailyTestSummaryId: string;

  @Column({
    name: 'online_offline_ind',
    type: 'numeric',
    precision: 38,
    scale: 0,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  onLineOffLineIndicator: number;

  @Column({
    name: 'calc_online_offline_ind',
    type: 'numeric',
    precision: 38,
    scale: 0,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  calcOnlineOfflineIndicator: number;

  @Column({
    name: 'upscale_gas_level_cd',
    type: 'varchar',
    length: 7,
    nullable: true,
  })
  upscaleGasCode: string;

  @Column({
    name: 'zero_injection_date',
    type: 'date',
    nullable: true,
  })
  zeroInjectionDate: Date;

  @Column({
    name: 'zero_injection_hour',
    type: 'numeric',
    precision: 2,
    scale: 0,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  zeroInjectionHour: number;

  @Column({
    name: 'zero_injection_min',
    type: 'numeric',
    precision: 2,
    scale: 0,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  zeroInjectionMinute: number;

  @Column({
    name: 'upscale_injection_date',
    type: 'date',
    nullable: true,
  })
  upscaleInjectionDate: Date;

  @Column({
    name: 'upscale_injection_hour',
    type: 'numeric',
    precision: 2,
    scale: 0,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  upscaleInjectionHour: number;

  @Column({
    name: 'upscale_injection_min',
    type: 'numeric',
    precision: 2,
    scale: 0,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  upscaleInjectionMinute: number;

  @Column({
    name: 'zero_measured_value',
    type: 'numeric',
    precision: 13,
    scale: 3,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  zeroMeasuredValue: number;

  @Column({
    name: 'upscale_measured_value',
    type: 'numeric',
    precision: 13,
    scale: 3,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  upscaleMeasuredValue: number;

  @Column({
    name: 'zero_aps_ind',
    type: 'numeric',
    precision: 38,
    scale: 0,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  zeroApsIndicator: number;

  @Column({
    name: 'calc_zero_aps_ind',
    type: 'numeric',
    precision: 38,
    scale: 0,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  calcZeroApsIndicator: number;

  @Column({
    name: 'upscale_aps_ind',
    type: 'numeric',
    precision: 38,
    scale: 0,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  upscaleApsIndicator: number;

  @Column({
    name: 'calc_upscale_aps_ind',
    type: 'numeric',
    precision: 38,
    scale: 0,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  calcUpscaleApsIndicator: number;

  @Column({
    name: 'zero_cal_error',
    type: 'numeric',
    precision: 6,
    scale: 2,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  zeroCalibrationError: number;

  @Column({
    name: 'calc_zero_cal_error',
    type: 'numeric',
    precision: 6,
    scale: 2,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  calcZeroCalibrationError: number;

  @Column({
    name: 'upscale_cal_error',
    type: 'numeric',
    precision: 6,
    scale: 2,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  upscaleCalibrationError: number;

  @Column({
    name: 'calc_upscale_cal_error',
    type: 'numeric',
    precision: 6,
    scale: 2,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  calcUpscaleCalibrationError: number;

  @Column({
    name: 'zero_ref_value',
    type: 'numeric',
    precision: 13,
    scale: 3,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  zeroReferenceValue: number;

  @Column({
    name: 'upscale_ref_value',
    type: 'numeric',
    precision: 13,
    scale: 3,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  upscaleReferenceValue: number;

  @Column({
    name: 'userid',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  userId: string;

  @Column({
    name: 'add_date',
    nullable: true,
  })
  addDate: Date;

  @Column({
    name: 'update_date',
    nullable: true,
  })
  updateDate: Date;

  @Column({
    name: 'rpt_period_id',
    type: 'numeric',
    precision: 38,
    scale: 0,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  reportingPeriodId: number;

  @Column({
    name: 'upscale_gas_type_cd',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  upscaleGasTypeCode: string;

  @Column({
    name: 'vendor_id',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  vendorIdentifier: string;

  @Column({
    name: 'cylinder_identifier',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  cylinderIdentifier: string;

  @Column({
    name: 'expiration_date',
    type: 'date',
    nullable: true,
  })
  expirationDate: Date;

  @Column({
    name: 'injection_protocol_cd',
    type: 'varchar',
    length: 7,
    nullable: true,
  })
  injectionProtocolCode: string;

  @ManyToOne(
    () => DailyTestSummary,
    o => o.dailyCalibrations,
  )
  @JoinColumn({ name: 'daily_test_sum_id' })
  dailyTestSummary: DailyTestSummary;
}
