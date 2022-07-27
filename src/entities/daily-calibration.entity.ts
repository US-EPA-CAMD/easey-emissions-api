import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.daily_calibration' })
export class DailyCalibration extends BaseEntity {
  @PrimaryColumn({
    name: 'cal_inj_id',
    nullable: false,
  })
  calInjId: string;

  @Column({ name: 'daily_test_sum_id', nullable: false })
  dailyTestSumId: string;

  @Column({
    name: 'online_offline_ind',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  onlineOfflineInd: number;

  @Column({
    name: 'calc_online_offline_ind',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  calcOnlineOfflineInd: number;

  @Column({ name: 'upscale_gas_level_cd', nullable: true })
  upscaleGasLevelCd: string;

  @Column({ name: 'zero_injection_date', nullable: true })
  zeroInjectionDate: Date;

  @Column({
    name: 'zero_injection_hour',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  zeroInjectionHour: number;

  @Column({
    name: 'zero_injection_min',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  zeroInjectionMin: number;

  @Column({
    name: 'upscale_injection_date',
    nullable: true,
  })
  upscaleInjectionDate: Date;

  @Column({
    name: 'upscale_injection_hour',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  upscaleInjectionHour: number;

  @Column({
    name: 'upscale_injection_min',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  upscaleInjectionMin: number;

  @Column({
    name: 'zero_measured_value',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  zeroMeasuredValue: number;

  @Column({
    name: 'upscale_measured_value',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  upscaleMeasuredValue: number;

  @Column({
    name: 'zero_aps_ind',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  zeroApsInd: number;

  @Column({
    name: 'calc_zero_aps_ind',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  calcZeroApsInd: number;

  @Column({
    name: 'upscale_aps_ind',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  upscaleApsInd: number;

  @Column({
    name: 'calc_upscale_aps_ind',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  calcUpscaleApsInd: number;

  @Column({
    name: 'zero_cal_error',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  zeroCalError: number;

  @Column({
    name: 'calc_zero_cal_error',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  calcZeroCalError: number;

  @Column({
    name: 'upscale_cal_error',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  upscaleCalError: number;

  @Column({
    name: 'calc_upscale_cal_error',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  calcUpscaleCalError: number;

  @Column({
    name: 'zero_ref_value',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  zeroRefValue: number;

  @Column({
    name: 'upscale_ref_value',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  upscaleRefValue: number;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @Column({
    name: 'rpt_period_id',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  rptPeriodId: number;

  @Column({ name: 'upscale_gas_type_cd', nullable: true })
  upscaleGasTypeCd: string;

  @Column({ name: 'vendor_id', nullable: true })
  vendorId: string;

  @Column({ name: 'cylinder_identifier', nullable: true })
  cylinderIdentifier: string;

  @Column({ name: 'expiration_date', nullable: true })
  expirationDate: Date;

  @Column({ name: 'injection_protocol_cd', nullable: true })
  injectionProtocolCd: string;
}
