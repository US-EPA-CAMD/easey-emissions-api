import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmps.nsps4t_annual' })
export class Nsps4tAnnual extends BaseEntity {
  @PrimaryColumn({ name: 'nsps4t_ann_id' })
  nsps4tAnnId: string;

  @Column({ name: 'nsps4t_sum_id' })
  nsps4tSumId: string;

  @Column({ name: 'annual_energy_sold' })
  annualEnergySold: number | null;

  @Column({ name: 'annual_energy_sold_type_cd' })
  annualEnergySoldTypeCd: string | null;

  @Column({ name: 'annual_potential_output' })
  annualPotentialOutput: number | null;

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
