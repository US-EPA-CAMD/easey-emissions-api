import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { HrlyOpData } from './hrly-op-data.entity';
import { MonitorSystem } from './monitor-system.entity';
import { MonitorFormula } from './monitor-formula.entity';
import { MonitorLocation } from './monitor-location.entity';
import { ReportingPeriod } from './reporting-period.entity';

@Entity({ name: 'camdecmps.derived_hrly_value' })
export class DerivedHrlyValue extends BaseEntity {
  @PrimaryColumn({ name: 'derv_id', nullable: false })
  id: string;

  @Column({ name: 'hour_id', nullable: false })
  hourId: string;

  @Column({ name: 'mon_sys_id', nullable: true })
  monSysId: string;

  @Column({ name: 'mon_form_id', nullable: true })
  monFormId: string;

  @Column({ name: 'parameter_cd', nullable: false })
  parameterCode: string;

  @Column({
    name: 'unadjusted_hrly_value',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  unadjustedHrlyValue: number;

  @Column({
    name: 'applicable_bias_adj_factor',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  applicableBiasAdjFactor: number;

  @Column({
    name: 'calc_unadjusted_hrly_value',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcUnadjustedHrlyValue: number;

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
  modcCode: string;

  @Column({ name: 'operating_condition_cd', nullable: true })
  operatingConditionCode: string;

  @Column({
    name: 'pct_available',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  pctAvailable: number;

  @Column({
    name: 'diluent_cap_ind',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  diluentCapInd: number;

  @Column({
    name: 'segment_num',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  segmentNum: number;

  @Column({ name: 'fuel_cd', nullable: true })
  fuelCode: string;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @Column({ name: 'calc_pct_diluent', nullable: true })
  calcPctDiluent: string;

  @Column({ name: 'calc_pct_moisture', nullable: true })
  calcPctMoisture: string;

  @Column({ name: 'calc_rata_status', nullable: true })
  calcRataStatus: string;

  @Column({ name: 'calc_appe_status', nullable: true })
  calcAppeStatus: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
    nullable: false,
  })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id', nullable: false })
  monitorLocationId: string;

  @Column({
    name: 'calc_fuel_flow_total',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcFuelFlowTotal: number;

  @Column({ name: 'calc_hour_measure_cd', nullable: true })
  calcHourMeasureCode: string;

  @ManyToOne(
    () => HrlyOpData,
    o => o.derivedHrlyValues,
  )
  @JoinColumn({ name: 'hour_id' })
  hrlyOpData: HrlyOpData;

  @ManyToOne(
    () => MonitorSystem,
    o => o.derivedHrlyValues,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  monitorSystem: MonitorSystem;

  @ManyToOne(
    () => MonitorFormula,
    o => o.derivedHrlyValues,
  )
  @JoinColumn({ name: 'mon_form_id' })
  monitorFormula: MonitorFormula;

  @ManyToOne(
    () => MonitorLocation,
    o => o.derivedHrlyValues,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  monitorLocation: MonitorLocation;

  @ManyToOne(
    () => ReportingPeriod,
    o => o.derivedHrlyValues,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  reportingPeriod: ReportingPeriod;
}
