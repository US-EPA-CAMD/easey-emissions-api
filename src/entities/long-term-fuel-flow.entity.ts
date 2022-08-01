import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { MonitorLocation } from './monitor-location.entity';
import { MonitorSystem } from './monitor-system.entity';
import { ReportingPeriod } from './reporting-period.entity';

@Entity({ name: 'camdecmps.long_term_fuel_flow' })
export class LongTermFuelFlow extends BaseEntity {
  @PrimaryColumn({ name: 'ltff_id', nullable: false })
  id: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id', nullable: true })
  monLocId: string;

  @Column({ name: 'mon_sys_id', nullable: true })
  monSysId: string;

  @Column({ name: 'fuel_flow_period_cd', nullable: true })
  fuelFlowPeriodCode: string;

  @Column({
    name: 'long_term_fuel_flow_value',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  longTermFuelFlowValue: number;

  @Column({ name: 'ltff_uom_cd', nullable: true })
  ltffUomCode: string;

  @Column({
    name: 'gross_calorific_value',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  grossCalorificValue: number;

  @Column({ name: 'gcv_uom_cd', nullable: true })
  gcvUomCode: string;

  @Column({
    name: 'total_heat_input',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  totalHeatInput: number;

  @Column({
    name: 'calc_total_heat_input',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcTotalHeatInput: number;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;
  
  @ManyToOne(
    () => MonitorLocation,
    o => o.longTermFuelFlows,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;

  @ManyToOne(
    () => MonitorSystem,
    o => o.longTermFuelFlows,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  system: MonitorSystem;

  @ManyToOne(
    () => ReportingPeriod,
    o => o.longTermFuelFlows,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  reportingPeriod: ReportingPeriod;

}
