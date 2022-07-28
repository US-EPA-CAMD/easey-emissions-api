import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.hrly_fuel_flow' })
export class HrlyFuelFlow extends BaseEntity {
  @PrimaryColumn({ name: 'hrly_fuel_flow_id', nullable: false })
  hrlyFuelFlowId: string;

  @Column({ name: 'hour_id', nullable: false })
  hourId: string;

  @Column({ name: 'mon_sys_id', nullable: true })
  monSysId: string;

  @Column({ name: 'fuel_cd', nullable: false })
  fuelCd: string;

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
  sodVolumetricCd: string;

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
  sodMassCd: string;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @Column({ name: 'volumetric_uom_cd', nullable: true })
  volumetricUomCd: string;

  @Column({
    name: 'calc_volumetric_flow_rate',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcVolumetricFlowRate: number;

  @Column({ name: 'calc_appd_status', nullable: true })
  calcAppdStatus: string;

  @Column({ name: 'rpt_period_id', nullable: false })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id', nullable: false })
  monLocId: string;
}