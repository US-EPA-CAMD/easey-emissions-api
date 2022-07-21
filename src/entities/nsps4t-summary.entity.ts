import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmps.nsps4t_summary' })
export class Nsps4tSummary extends BaseEntity {
  @PrimaryColumn({ name: 'nsps4t_sum_id' })
  nsps4tSumId: string;

  @Column({ name: 'emission_standard_cd' })
  emissionStandardCd: string | null;

  @Column({ name: 'modus_value' })
  modusValue: number | null;

  @Column({ name: 'modus_uom_cd' })
  modusUomCd: string | null;

  @Column({ name: 'electrical_load_cd' })
  electricalLoadCd: string | null;

  @Column({ name: 'no_period_ended_ind' })
  noPeriodEndedInd: number | null;

  @Column({ name: 'no_period_ended_comment' })
  noPeriodEndedComment: string | null;

  @Column({ name: 'mon_loc_id' })
  monLocId: string;

  @Column({ name: 'rpt_period_id' })
  rptPeriodId: number;

  @Column({ name: 'userid' })
  userId: string;

  @Column({ name: 'add_date' })
  addDate: Date;

  @Column({ name: 'update_date' })
  updateDate: Date | null;
}
