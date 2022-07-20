import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.daily_emission' })
export class DailyEmission extends BaseEntity {
  @PrimaryColumn({
    name: 'unit_id',
    nullable: false,
    transformer: new NumericColumnTransformer(),
  })
  id: number;

  @Column({ name: 'rpt_period_id', nullable: false })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id', nullable: false })
  monLocId: string;

  @Column({ name: 'parameter_cd', nullable: false })
  parameterCd: string;

  @Column({ name: 'begin_date', nullable: false })
  beginDate: Date;

  @Column({ name: 'total_daily_emission', nullable: true })
  totalDailyEmission: number;

  @Column({ name: 'adjusted_daily_emission', nullable: true })
  adjustedDailyEmission: number;

  @Column({ name: 'sorbent_mass_emission', nullable: true })
  sorbentMassEmission: number;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @Column({ name: 'unadjusted_daily_emission', nullable: true })
  unadjustedDailyEmission: number;

  @Column({ name: 'total_carbon_burned', nullable: true })
  totalCarbonBurned: number;

  @Column({ name: 'calc_total_daily_emission', nullable: true })
  calcTotalDailyEmission: number;

  @Column({ name: 'calc_total_op_time', nullable: true })
  calcTotalOpTime: number;
}
