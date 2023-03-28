import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { MonitorLocation } from './monitor-location.entity';
import { ReportingPeriod } from './reporting-period.entity';
import { MonitorSystem } from './monitor-system.entity';
import { SamplingTrain } from './sampling-train.entity';

@Entity({ name: 'camdecmps.sorbent_trap' })
export class SorbentTrap extends BaseEntity {
  @PrimaryColumn({ name: 'trap_id', nullable: false })
  id: string;

  @Column({ nullable: false, name: 'mon_loc_id' })
  monitoringLocationId: string;

  @Column({ nullable: false, name: 'rpt_period_id' })
  reportingPeriodId: number;

  @Column({ nullable: false, type: 'date', name: 'begin_date' })
  beginDate: Date;

  @Column({
    nullable: false,
    name: 'begin_hour',
    transformer: new NumericColumnTransformer(),
  })
  beginHour: number;

  @Column({ nullable: false, type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({
    nullable: false,
    name: 'end_hour',
    transformer: new NumericColumnTransformer(),
  })
  endHour: number;

  @Column({ nullable: false, name: 'mon_sys_id' })
  monitoringSystemId: string;

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
  absoluteDifferenceIndicator: number;

  @Column({ name: 'modc_cd', nullable: true })
  modcCode: string;

  @Column({ name: 'hg_concentration', nullable: true })
  hgSystemConcentration: string;

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
  apsCode: string;

  @Column({ name: 'rata_ind', nullable: true })
  rataIndicator: number;

  @ManyToOne(
    () => MonitorLocation,
    o => o.sorbentTraps,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  monitorLocation: MonitorLocation;

  @ManyToOne(
    () => MonitorSystem,
    o => o.sorbentTraps,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  monitorSystem: MonitorSystem;

  @ManyToOne(
    () => ReportingPeriod,
    o => o.sorbentTraps,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  reportingPeriod: ReportingPeriod;

  @OneToMany(
    () => SamplingTrain,
    o => o.sorbentTrap,
  )
  @JoinColumn({ name: 'trap_id' })
  samplingTrains: SamplingTrain[];
}
