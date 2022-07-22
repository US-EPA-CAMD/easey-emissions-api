import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.daily_fuel' })
export class DailyFuel extends BaseEntity {
  @PrimaryColumn({ name: 'daily_fuel_id' })
  dailyFuelId: string;

  @Column({ name: 'daily_emission_id' })
  dailyEmissionId: string;

  @Column({ name: 'fuel_cd' })
  fuelCd: string;

  @Column({
    name: 'daily_fuel_feed',
    transformer: new NumericColumnTransformer(),
  })
  dailyFuelFeed: number | null;

  @Column({
    name: 'carbon_content_used',
    transformer: new NumericColumnTransformer(),
  })
  carbonContentUsed: number | null;

  @Column({
    name: 'fuel_carbon_burned',
    transformer: new NumericColumnTransformer(),
  })
  fuelCarbonBurned: number | null;

  @Column({
    name: 'calc_fuel_carbon_burned',
    transformer: new NumericColumnTransformer(),
  })
  calcFuelCarbonBurned: number | null;

  @Column({ name: 'userid' })
  userId: string;

  @Column({ name: 'add_date' })
  addDate: Date;

  @Column({ name: 'update_date' })
  updateDate: Date | null;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id' })
  monLocId: string;
}
