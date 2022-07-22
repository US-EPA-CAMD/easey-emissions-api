import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.sorbent_trap' })
export class SorbentTrap extends BaseEntity {
  @PrimaryColumn({ name: 'trap_id' })
  trapId: string;

  @Column({ name: 'mon_loc_id' })
  monLocId: string;

  @Column({ name: 'rpt_period_id' })
  rptPeriodId: number;

  @Column({ name: 'begin_date' })
  beginDate: Date;

  @Column({ name: 'begin_hour', transformer: new NumericColumnTransformer() })
  beginHour: number;

  @Column({ name: 'end_date' })
  endDate: Date;

  @Column({ name: 'end_hour', transformer: new NumericColumnTransformer() })
  endHour: number;

  @Column({ name: 'mon_sys_id' })
  monSysId: string;

  @Column({
    name: 'paired_trap_agreement',
    transformer: new NumericColumnTransformer(),
  })
  pairedTrapAgreement: number | null;

  @Column({
    name: 'absolute_difference_ind',
    transformer: new NumericColumnTransformer(),
  })
  absoluteDifferenceInd: number | null;

  @Column({ name: 'modc_cd' })
  modcCd: string | null;

  @Column({ name: 'hg_concentration' })
  hgConcentration: string | null;

  @Column({
    name: 'calc_paired_trap_agreement',
    transformer: new NumericColumnTransformer(),
  })
  calcPairedTrapAgreement: number | null;

  @Column({ name: 'calc_modc_cd' })
  calcModcCd: string | null;

  @Column({ name: 'calc_hg_concentration' })
  calcHgConcentration: string | null;

  @Column({ name: 'userid' })
  userId: string | null;

  @Column({ name: 'add_date' })
  addDate: Date | null;

  @Column({ name: 'update_date' })
  updateDate: Date | null;

  @Column({ name: 'sorbent_trap_aps_cd' })
  sorbentTrapApsCd: string | null;

  @Column({ name: 'rata_ind' })
  rataInd: number | null;
}
