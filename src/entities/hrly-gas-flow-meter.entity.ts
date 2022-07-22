import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.hrly_gas_flow_meter' })
export class HrlyGasFlowMeter extends BaseEntity {
  @PrimaryColumn({ name: 'hrly_gas_flow_meter_id' })
  hrlyGasFlowMeterId: string;

  @Column({ name: 'hour_id' })
  hourId: string;

  @Column({ name: 'mon_loc_id' })
  monLocId: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  rptPeriodId: number;

  @Column({ name: 'component_id' })
  componentId: string;

  @Column({ name: 'begin_end_hour_flg' })
  beginEndHourFlg: string | null;

  @Column({ name: 'gfm_reading', transformer: new NumericColumnTransformer() })
  gfmReading: number | null;

  @Column({
    name: 'avg_sampling_rate',
    transformer: new NumericColumnTransformer(),
  })
  avgSamplingRate: number | null;

  @Column({ name: 'sampling_rate_uom' })
  samplingRateUom: string | null;

  @Column({
    name: 'flow_to_sampling_ratio',
    transformer: new NumericColumnTransformer(),
  })
  flowToSamplingRatio: number | null;

  @Column({
    name: 'calc_flow_to_sampling_ratio',
    transformer: new NumericColumnTransformer(),
  })
  calcFlowToSamplingRatio: number | null;

  @Column({
    name: 'calc_flow_to_sampling_mult',
    transformer: new NumericColumnTransformer(),
  })
  calcFlowToSamplingMult: number | null;

  @Column({ name: 'userid' })
  userId: string | null;

  @Column({ name: 'add_date' })
  addDate: Date | null;

  @Column({ name: 'update_date' })
  updateDate: Date | null;
}
