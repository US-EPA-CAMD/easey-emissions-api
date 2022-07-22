import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmps.daily_fuel' })
export class DailyFuel extends BaseEntity {
  @PrimaryColumn({ name: 'daily_fuel_id' })
  dailyFuelId: string;

  @Column({ name: 'daily_emission_id' })
  dailyEmissionId: string;

  @Column({ name: 'fuel_cd' })
  fuelCd: string;

  @Column({ name: 'daily_fuel_feed' })
  dailyFuelFeed: number | null;

  @Column({ name: 'carbon_content_used' })
  carbonContentUsed: number | null;

  @Column({ name: 'fuel_carbon_burned' })
  fuelCarbonBurned: number | null;

  @Column({ name: 'calc_fuel_carbon_burned' })
  calcFuelCarbonBurned: number | null;

  @Column({ name: 'userid' })
  userId: string;

  @Column({ name: 'add_date' })
  addDate: Date;

  @Column({ name: 'update_date' })
  updateDate: Date | null;

  @Column({ name: 'rpt_period_id' })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id' })
  monLocId: string;
}
