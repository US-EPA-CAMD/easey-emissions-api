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
import { MonitorSystem } from './monitor-system.entity';
import { HrlyOpData } from './hrly-op-data.entity';
import { HrlyParamFuelFlow } from './hrly-param-fuel-flow.entity';

@Entity({ name: 'camdecmpswks.hrly_fuel_flow' })
export class HrlyFuelFlow extends BaseEntity {
  @PrimaryColumn({ name: 'hrly_fuel_flow_id', nullable: false })
  id: string;

  @Column({ name: 'hour_id', nullable: false })
  hourId: string;

  @Column({ name: 'mon_sys_id', nullable: true })
  monitoringSystemId: string;

  @Column({ name: 'fuel_cd', nullable: false })
  fuelCode: string;

  @Column({
    name: 'fuel_usage_time',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  fuelUsageTime: number;

  @Column({
    name: 'volumetric_flow_rate',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  volumetricFlowRate: number;

  @Column({ name: 'sod_volumetric_cd', nullable: true })
  sourceOfDataVolumetricCode: string;

  @Column({
    name: 'mass_flow_rate',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  massFlowRate: number;

  @Column({
    name: 'calc_mass_flow_rate',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcMassFlowRate: number;

  @Column({ name: 'sod_mass_cd', nullable: true })
  sourceOfDataMassCode: string;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @Column({ name: 'volumetric_uom_cd', nullable: true })
  volumetricUnitsOfMeasureCode: string;

  @Column({
    name: 'calc_volumetric_flow_rate',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcVolumetricFlowRate: number;

  @Column({ name: 'calc_appd_status', nullable: true })
  calcAppdStatus: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
    nullable: false,
  })
  reportingPeriodId: number;

  @Column({ name: 'mon_loc_id', nullable: false })
  monitoringLocationId: string;

  @ManyToOne(
    () => MonitorSystem,
    o => o.hrlyFuelFlows,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  monitorSystem: MonitorSystem;

  @ManyToOne(
    () => HrlyOpData,
    o => o.hrlyFuelFlows,
  )
  @JoinColumn({ name: 'hour_id' })
  hrlyOpData: HrlyOpData;

  @OneToMany(
    () => HrlyParamFuelFlow,
    c => c.hrlyFuelFlow,
  )
  @JoinColumn({ name: 'hrly_fuel_flow_id' })
  hrlyParamFuelFlows: HrlyParamFuelFlow[];
}
