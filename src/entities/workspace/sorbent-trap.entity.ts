import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { SamplingTrain } from './sampling-train.entity';

@Entity({ name: 'camdecmpswks.sorbent_trap' })
export class SorbentTrap extends BaseEntity {
  @PrimaryColumn({ name: 'trap_id', nullable: false })
  id: string;

  @Column({ nullable: false, name: 'mon_loc_id' })
  monLocId: string;

  @Column({ nullable: false, name: 'rpt_period_id' })
  rptPeriodId: number;

  @Column({ nullable: false, name: 'begin_date' })
  beginDate: Date;

  @Column({
    nullable: false,
    name: 'begin_hour',
    transformer: new NumericColumnTransformer(),
  })
  beginHour: number;

  @Column({ nullable: false, name: 'end_date' })
  endDate: Date;

  @Column({
    nullable: false,
    name: 'end_hour',
    transformer: new NumericColumnTransformer(),
  })
  endHour: number;

  @Column({ nullable: false, name: 'mon_sys_id' })
  monSysId: string;

  @Column({
    name: 'paired_trap_agreement',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  pairedTrapAgreement: number;

  @Column({
    name: 'absolute_difference_ind',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  absoluteDifferenceInd: number;

  @Column({ name: 'modc_cd', nullable: true })
  modcCode: string;

  @Column({ name: 'hg_concentration', nullable: true })
  hgConcentration: string;

  @Column({
    name: 'calc_paired_trap_agreement',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcPairedTrapAgreement: number;

  @Column({ name: 'calc_modc_cd', nullable: true })
  calcModcCode: string;

  @Column({ name: 'calc_hg_concentration', nullable: true })
  calcHgConcentration: string;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @Column({ name: 'sorbent_trap_aps_cd', nullable: true })
  sorbentTrapApsCode: string;

  @Column({ name: 'rata_ind', nullable: true })
  rataInd: number;

  @OneToMany(
    () => SamplingTrain,
    o => o.sorbentTrap,
  )
  @JoinColumn({ name: 'trap_id' })
  samplingTrains: SamplingTrain[];
}
