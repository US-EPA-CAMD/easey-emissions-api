import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.monitor-hrly-value.entity' })
export class MonitorHrlyValue extends BaseEntity {
  @PrimaryColumn({ name: 'monitor_hrly_val_id', nullable: false })
  monitorHrlyValId: string;

  @Column({ name: 'hour_id', nullable: false })
  hourId: string;

  @Column({ name: 'mon_sys_id', nullable: true })
  monSysId: string;

  @Column({ name: 'component_id', nullable: true })
  componentId: string;

  @Column({ name: 'parameter_cd', nullable: false })
  parameterCd: string;

  @Column({
    name: 'applicable_bias_adj_factor',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  applicableBiasAdjFactor: number;

  @Column({
    name: 'unadjusted_hrly_value',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  unadjustedHrlyValue: number;

  @Column({
    name: 'adjusted_hrly_value',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  adjustedHrlyValue: number;

  @Column({
    name: 'calc_adjusted_hrly_value',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcAdjustedHrlyValue: number;

  @Column({ name: 'modc_cd', nullable: true })
  modcCd: string;

  @Column({
    name: 'pct_available',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  pctAvailable: number;

  @Column({ name: 'moisture_basis', nullable: true })
  moistureBasis: string;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @Column({ name: 'calc_line_status', nullable: true })
  calcLineStatus: string;

  @Column({ name: 'calc_rata_status', nullable: true })
  calcRataStatus: string;

  @Column({ name: 'calc_daycal_status', nullable: true })
  calcDaycalStatus: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
    nullable: false,
  })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id', nullable: false })
  monLocId: string;

  @Column({ name: 'calc_leak_status', nullable: true })
  calcLeakStatus: string;

  @Column({ name: 'calc_dayint_status', nullable: true })
  calcDayintStatus: string;

  @Column({ name: 'calc_f2l_status', nullable: true })
  calcF2lStatus: string;
}
