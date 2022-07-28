import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.hrly_gas_flow_meter' })
export class HrlyGasFlowMeter extends BaseEntity {
  @PrimaryColumn({ name: 'hrly_gas_flow_meter_id', nullable: false })
  hrlyGasFlowMeterId: string;

  @Column({ nullable: false, name: 'hour_id' })
  hourId: string;

  @Column({ nullable: false, name: 'mon_loc_id' })
  monLocId: string;

  @Column({
    nullable: false,
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  rptPeriodId: number;

  @Column({ nullable: false, name: 'component_id' })
  componentId: string;

  @Column({ name: 'begin_end_hour_flg', nullable: true })
  beginEndHourFlg: string;

  @Column({
    name: 'gfm_reading',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  gfmReading: number;

  @Column({
    name: 'avg_sampling_rate',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  avgSamplingRate: number;

  @Column({ name: 'sampling_rate_uom', nullable: true })
  samplingRateUom: string;

  @Column({
    name: 'flow_to_sampling_ratio',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  flowToSamplingRatio: number;

  @Column({
    name: 'calc_flow_to_sampling_ratio',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcFlowToSamplingRatio: number;

  @Column({
    name: 'calc_flow_to_sampling_mult',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcFlowToSamplingMult: number;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;
}