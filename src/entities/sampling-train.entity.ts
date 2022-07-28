import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.sampling_train' })
export class SamplingTrain extends BaseEntity {
  @PrimaryColumn({ name: 'trap_train_id', nullable: false })
  trapTrainId: string;

  @Column({ name: 'trap_id', nullable: false })
  trapId: string;

  @Column({ name: 'mon_loc_id', nullable: false })
  monLocId: string;

  @Column({
    name: 'rpt_period_id',
    nullable: false,
    transformer: new NumericColumnTransformer(),
  })
  rptPeriodId: number;

  @Column({ name: 'component_id', nullable: true })
  componentId: string;

  @Column({ name: 'sorbent_trap_serial_number', nullable: false })
  sorbentTrapSerialNumber: string;

  @Column({ name: 'main_trap_hg', nullable: true })
  mainTrapHg: string;

  @Column({ name: 'breakthrough_trap_hg', nullable: true })
  breakthroughTrapHg: string;

  @Column({ name: 'spike_trap_hg', nullable: true })
  spikeTrapHg: string;

  @Column({ name: 'spike_ref_value', nullable: true })
  spikeRefValue: string;

  @Column({
    name: 'total_sample_volume',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  totalSampleVolume: number;

  @Column({
    name: 'ref_flow_to_sampling_ratio',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  refFlowToSamplingRatio: number;

  @Column({ name: 'hg_concentration', nullable: true })
  hgConcentration: string;

  @Column({
    name: 'percent_breakthrough',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  percentBreakthrough: number;

  @Column({
    name: 'percent_spike_recovery',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  percentSpikeRecovery: number;

  @Column({ name: 'sampling_ratio_test_result_cd', nullable: true })
  samplingRatioTestResultCd: string;

  @Column({ name: 'post_leak_test_result_cd', nullable: true })
  postLeakTestResultCd: string;

  @Column({ name: 'train_qa_status_cd', nullable: true })
  trainQaStatusCd: string;

  @Column({ name: 'sample_damage_explanation', nullable: true })
  sampleDamageExplanation: string;

  @Column({ name: 'calc_hg_concentration', nullable: true })
  calcHgConcentration: string;

  @Column({
    name: 'calc_percent_breakthrough',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  calcPercentBreakthrough: number;

  @Column({
    name: 'calc_percent_spike_recovery',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  calcPercentSpikeRecovery: number;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;
}