import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.hrly_op_data' })
export class HrlyOpData extends BaseEntity {
  @PrimaryColumn({ name: 'hour_id' })
  hourId: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id' })
  monLocId: string;

  @Column({ name: 'begin_date' })
  beginDate: Date;

  @Column({ name: 'begin_hour', transformer: new NumericColumnTransformer() })
  beginHour: number;

  @Column({ name: 'op_time', transformer: new NumericColumnTransformer() })
  opTime: number | null;

  @Column({ name: 'hr_load', transformer: new NumericColumnTransformer() })
  hrLoad: number | null;

  @Column({ name: 'load_range', transformer: new NumericColumnTransformer() })
  loadRange: number | null;

  @Column({
    name: 'common_stack_load_range',
    transformer: new NumericColumnTransformer(),
  })
  commonStackLoadRange: number | null;

  @Column({ name: 'fc_factor', transformer: new NumericColumnTransformer() })
  fcFactor: number | null;

  @Column({ name: 'fd_factor', transformer: new NumericColumnTransformer() })
  fdFactor: number | null;

  @Column({ name: 'fw_factor', transformer: new NumericColumnTransformer() })
  fwFactor: number | null;

  @Column({ name: 'fuel_cd' })
  fuelCd: string | null;

  @Column({ name: 'multi_fuel_flg' })
  multiFuelFlg: string | null;

  @Column({ name: 'userid' })
  userId: string | null;

  @Column({ name: 'add_date' })
  addDate: Date | null;

  @Column({ name: 'update_date' })
  updateDate: Date | null;

  @Column({ name: 'load_uom_cd' })
  loadUomCd: string | null;

  @Column({ name: 'operating_condition_cd' })
  operatingConditionCd: string | null;

  @Column({ name: 'fuel_cd_list' })
  fuelCdList: string | null;

  @Column({
    name: 'mhhi_indicator',
    transformer: new NumericColumnTransformer(),
  })
  mhhiIndicator: number | null;

  @Column({ name: 'mats_load', transformer: new NumericColumnTransformer() })
  matsLoad: number | null;

  @Column({ name: 'mats_startup_shutdown_flg' })
  matsStartupShutdownFlg: string | null;
}
