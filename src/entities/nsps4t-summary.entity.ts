import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.nsps4t_summary' })
export class Nsps4tSummary extends BaseEntity {
  @PrimaryColumn({ name: 'nsps4t_sum_id', nullable: false })
  nsps4tSumId: string;

  @Column({ name: 'emission_standard_cd', nullable: true })
  emissionStandardCd: string;

  @Column({
    name: 'modus_value',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  modusValue: number;

  @Column({ name: 'modus_uom_cd', nullable: true })
  modusUomCd: string;

  @Column({ name: 'electrical_load_cd', nullable: true })
  electricalLoadCd: string;

  @Column({
    name: 'no_period_ended_ind',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  noPeriodEndedInd: number;

  @Column({ name: 'no_period_ended_comment', nullable: true })
  noPeriodEndedComment: string;

  @Column({ name: 'mon_loc_id', nullable: false })
  monLocId: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
    nullable: false,
  })
  rptPeriodId: number;

  @Column({ name: 'userid', nullable: false })
  userId: string;

  @Column({ name: 'add_date', nullable: false })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;
}
