import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { HrlyFuelFlow } from './hrly-fuel-flow.entity';
import { MonitorFormula } from './monitor-formula.entity';
import { MonitorSystem } from './monitor-system.entity';

@Entity({ name: 'camdecmps.hrly_param_fuel_flow' })
export class HrlyParamFuelFlow extends BaseEntity {
  @PrimaryColumn({ name: 'hrly_param_ff_id', nullable: false })
  id: string;

  @Column({ name: 'hrly_fuel_flow_id', nullable: false })
  hrlyFuelFlowId: string;

  @Column({ name: 'mon_sys_id', nullable: true })
  monitoringSystemId: string;

  @Column({ name: 'mon_form_id', nullable: true })
  formulaIdentifier: string;

  @Column({ name: 'parameter_cd', nullable: false })
  parameterCode: string;

  @Column({
    name: 'param_val_fuel',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  parameterValueForFuel: number;

  @Column({
    name: 'calc_param_val_fuel',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  calcParamValFuel: number;

  @Column({ name: 'sample_type_cd', nullable: true })
  sampleTypeCode: string;

  @Column({ name: 'operating_condition_cd', nullable: true })
  operatingConditionCode: string;

  @Column({
    name: 'segment_num',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  segmentNumber: number;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @Column({ name: 'parameter_uom_cd', nullable: true })
  parameterUomCode: string;

  @Column({ name: 'calc_appe_status', nullable: true })
  calcAppeStatus: string;

  @Column({
    name: 'rpt_period_id',
    nullable: false,
    transformer: new NumericColumnTransformer(),
  })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id', nullable: false })
  monLocId: string;

  @ManyToOne(
    () => HrlyFuelFlow,
    o => o.hourlyParameterFuelFlowData,
  )
  @JoinColumn({ name: 'hrly_fuel_flow_id' })
  hrlyFuelFlow: HrlyFuelFlow;

  @ManyToOne(
    () => MonitorFormula,
    o => o.hrlyParamFuelFlows,
  )
  @JoinColumn({ name: 'mon_form_id' })
  formula: MonitorFormula;

  @ManyToOne(
    () => MonitorSystem,
    o => o.hrlyParamFuelFlows,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  system: MonitorSystem;
}
