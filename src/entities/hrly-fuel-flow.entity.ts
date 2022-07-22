import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.hrly_fuel_flow' })
export class HrlyFuelFlow extends BaseEntity {
  @PrimaryColumn({ name: 'hrly_fuel_flow_id' })
  hrlyFuelFlowId: string;

  @Column({ name: 'hour_id' })
  hourId: string;

  @Column({ name: 'mon_sys_id' })
  monSysId: string | null;

  @Column({ name: 'fuel_cd' })
  fuelCd: string;

  @Column({
    name: 'fuel_usage_time',
    transformer: new NumericColumnTransformer(),
  })
  fuelUsageTime: number | null;

  @Column({
    name: 'volumetric_flow_rate',
    transformer: new NumericColumnTransformer(),
  })
  volumetricFlowRate: number | null;

  @Column({ name: 'sod_volumetric_cd' })
  sodVolumetricCd: string | null;

  @Column({
    name: 'mass_flow_rate',
    transformer: new NumericColumnTransformer(),
  })
  massFlowRate: number | null;

  @Column({
    name: 'calc_mass_flow_rate',
    transformer: new NumericColumnTransformer(),
  })
  calcMassFlowRate: number | null;

  @Column({ name: 'sod_mass_cd' })
  sodMassCd: string | null;

  @Column({ name: 'userid' })
  userId: string | null;

  @Column({ name: 'add_date' })
  addDate: Date | null;

  @Column({ name: 'update_date' })
  updateDate: Date | null;

  @Column({ name: 'volumetric_uom_cd' })
  volumetricUomCd: string | null;

  @Column({
    name: 'calc_volumetric_flow_rate',
    transformer: new NumericColumnTransformer(),
  })
  calcVolumetricFlowRate: number | null;

  @Column({ name: 'calc_appd_status' })
  calcAppdStatus: string | null;

  @Column({ name: 'rpt_period_id' })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id' })
  monLocId: string;
}
