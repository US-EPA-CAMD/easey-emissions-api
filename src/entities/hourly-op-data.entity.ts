import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmps.hrly_op_data' })
export class HourlyOpData extends BaseEntity {
  @PrimaryColumn({ name: 'hour_id' })
  hourId: string;

  @Column({ name: 'rpt_period_id' })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id' })
  monLocId: string;

  @Column({ name: 'begin_date' })
  beginDate: Date;

  @Column({ name: 'begin_hour' })
  beginHour: number;

  @Column({ name: 'op_time' })
  opTime: number | null;

  @Column({ name: 'hr_load' })
  hrLoad: number | null;

  @Column({ name: 'load_range' })
  loadRange: number | null;

  @Column({ name: 'common_stack_load_range' })
  commonStackLoadRange: number | null;

  @Column({ name: 'fc_factor' })
  fcFactor: number | null;

  @Column({ name: 'fd_factor' })
  fdFactor: number | null;

  @Column({ name: 'fw_factor' })
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

  @Column({ name: 'mhhi_indicator' })
  mhhiIndicator: number | null;

  @Column({ name: 'mats_load' })
  matsLoad: number | null;

  @Column({ name: 'mats_startup_shutdown_flg' })
  matsStartupShutdownFlg: string | null;
}
