import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.nsps4t_annual' })
export class Nsps4tAnnual extends BaseEntity {
  @PrimaryColumn({ name: 'nsps4t_ann_id', nullable: false })
  nsps4tAnnId: string;

  @Column({ name: 'nsps4t_sum_id', nullable: false })
  nsps4tSumId: string;

  @Column({
    name: 'annual_energy_sold',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  annualEnergySold: number;

  @Column({ name: 'annual_energy_sold_type_cd', nullable: true })
  annualEnergySoldTypeCd: string;

  @Column({
    name: 'annual_potential_output',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  annualPotentialOutput: number;

  @Column({ nullable: false, name: 'mon_loc_id' })
  monLocId: string;

  @Column({
    nullable: false,
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  rptPeriodId: number;

  @Column({ nullable: false, name: 'userid' })
  userId: string;

  @Column({ nullable: false, name: 'add_date' })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;
}
