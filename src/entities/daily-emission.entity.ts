import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { ReportingPeriod } from './reporting-period.entity';
import { MonitorLocation } from './monitor-location.entity';
import { DailyFuel } from './daily-fuel.entity';

@Entity({ name: 'camdecmps.daily_emission' })
export class DailyEmission extends BaseEntity {
  @PrimaryColumn({
    name: 'daily_emission_id',
    nullable: false,
  })
  id: string;

  @Column({
    nullable: false,
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id', nullable: false })
  monLocId: string;

  @Column({ name: 'parameter_cd', nullable: false })
  parameterCd: string;

  @Column({ name: 'begin_date', nullable: false })
  beginDate: Date;

  @Column({
    nullable: true,
    name: 'total_daily_emission',
    transformer: new NumericColumnTransformer(),
  })
  totalDailyEmission: number;

  @Column({
    nullable: true,
    name: 'adjusted_daily_emission',
    transformer: new NumericColumnTransformer(),
  })
  adjustedDailyEmission: number;

  @Column({
    nullable: true,
    name: 'sorbent_mass_emission',
    transformer: new NumericColumnTransformer(),
  })
  sorbentMassEmission: number;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @Column({
    name: 'unadjusted_daily_emission',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  unadjustedDailyEmission: number;

  @Column({
    name: 'total_carbon_burned',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  totalCarbonBurned: number;

  @Column({
    name: 'calc_total_daily_emission',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcTotalDailyEmission: number;

  @Column({
    name: 'calc_total_op_time',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcTotalOpTime: number;

  @ManyToOne(
    () => ReportingPeriod,
    o => o.dailyEmissions,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  reportingPeriod: ReportingPeriod;

  @ManyToOne(
    () => MonitorLocation,
    o => o.dailyEmissions,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;

  @ManyToOne(
    () => DailyFuel,
    o => o.dailyEmissions,
  )
  dailyFuel: DailyFuel;

}
