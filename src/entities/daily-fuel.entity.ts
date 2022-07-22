import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.daily_fuel' })
export class DailyFuel extends BaseEntity {
  @PrimaryColumn({ name: 'daily_fuel_id', nullable: false })
  dailyFuelId: string;

  @Column({ name: 'daily_emission_id', nullable: false })
  dailyEmissionId: string;

  @Column({ name: 'fuel_cd', nullable: false })
  fuelCd: string;

  @Column({
    name: 'daily_fuel_feed',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  dailyFuelFeed: number;

  @Column({
    name: 'carbon_content_used',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  carbonContentUsed: number;

  @Column({
    name: 'fuel_carbon_burned',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  fuelCarbonBurned: number;

  @Column({
    name: 'calc_fuel_carbon_burned',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcFuelCarbonBurned: number;

  @Column({ name: 'userid', nullable: false })
  userId: string;

  @Column({ name: 'add_date', nullable: false })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
    nullable: false,
  })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id', nullable: false })
  monLocId: string;
}
