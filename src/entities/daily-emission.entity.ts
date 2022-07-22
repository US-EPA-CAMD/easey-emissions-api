import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.daily_emission' })
export class DailyEmission extends BaseEntity {
  @PrimaryColumn({
    name: 'daily_emission_id',
  })
  dailyEmissionId: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id' })
  monLocId: string;

  @Column({ name: 'parameter_cd' })
  parameterCd: string;

  @Column({ name: 'begin_date' })
  beginDate: Date;

  @Column({
    name: 'total_daily_emission',
    transformer: new NumericColumnTransformer(),
  })
  totalDailyEmission: number | null;

  @Column({
    name: 'adjusted_daily_emission',
    transformer: new NumericColumnTransformer(),
  })
  adjustedDailyEmission: number | null;

  @Column({
    name: 'sorbent_mass_emission',
    transformer: new NumericColumnTransformer(),
  })
  sorbentMassEmission: number | null;

  @Column({ name: 'userid' })
  userId: string | null;

  @Column({ name: 'add_date' })
  addDate: Date | null;

  @Column({ name: 'update_date' })
  updateDate: Date | null;

  @Column({
    name: 'unadjusted_daily_emission',
    transformer: new NumericColumnTransformer(),
  })
  unadjustedDailyEmission: number | null;

  @Column({
    name: 'total_carbon_burned',
    transformer: new NumericColumnTransformer(),
  })
  totalCarbonBurned: number | null;

  @Column({
    name: 'calc_total_daily_emission',
    transformer: new NumericColumnTransformer(),
  })
  calcTotalDailyEmission: number | null;

  @Column({
    name: 'calc_total_op_time',
    transformer: new NumericColumnTransformer(),
  })
  calcTotalOpTime: number | null;
}
