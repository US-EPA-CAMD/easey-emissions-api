import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { MonitorLocation } from './monitor-location.entity';
import { DailyFuel } from './daily-fuel.entity';
import { ReportingPeriod } from './reporting-period.entity';

@Entity({ name: 'camdecmpswks.daily_emission' })
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
  reportingPeriodId: number;

  @Column({ name: 'mon_loc_id', nullable: false })
  monitoringLocationId: string;

  @Column({ name: 'parameter_cd', nullable: false })
  parameterCode: string;

  @Column({ name: 'begin_date', nullable: false })
  date: Date;

  @Column({
    nullable: true,
    name: 'total_daily_emission',
    transformer: new NumericColumnTransformer(),
  })
  totalDailyEmissions: number;

  @Column({
    nullable: true,
    name: 'adjusted_daily_emission',
    transformer: new NumericColumnTransformer(),
  })
  adjustedDailyEmissions: number;

  @Column({
    nullable: true,
    name: 'sorbent_mass_emission',
    transformer: new NumericColumnTransformer(),
  })
  sorbentRelatedMassEmissions: number;

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
  unadjustedDailyEmissions: number;

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
  calcTotalDailyEmissions: number;

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
  monitorLocation: MonitorLocation;

  @OneToMany(
    () => DailyFuel,
    o => o.dailyEmission,
  )
  @JoinColumn({ name: 'daily_emission_id' })
  dailyFuelData: DailyFuel[];
}
