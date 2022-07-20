import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmps.hrly_op_data' })
export class HourlyOpData extends BaseEntity {
  @PrimaryColumn({ name: 'hour_id', nullable: false })
  hourId: string;

  @Column({ name: 'rpt_period_id', nullable: false })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id', nullable: false })
  monLocId: string;

  @Column({ name: 'begin_date', nullable: false })
  beginDate: Date;

  @Column({ name: 'begin_hour', nullable: false })
  beginHour: number;

  @Column({ name: 'op_time', nullable: true })
  opTime: number;

  @Column({ name: 'hr_load', nullable: true })
  hrLoad: number;

  @Column({ name: 'load_range', nullable: true })
  loadRange: number;

  @Column({ name: 'common_stack_load_range', nullable: true })
  commonStackLoadRange: number;

  @Column({ name: 'fc_factor', nullable: true })
  fcFactor: number;

  @Column({ name: 'fd_factor', nullable: true })
  fdFactor: number;

  @Column({ name: 'fw_factor', nullable: true })
  fwFactor: number;

  @Column({ name: 'fuel_cd', nullable: true })
  fuelCd: string;

  @Column({ name: 'multi_fuel_flg', nullable: true })
  multiFuelFlg: string;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @Column({ name: 'load_uom_cd', nullable: true })
  loadUomCd: string;

  @Column({ name: 'operating_condition_cd', nullable: true })
  operatingConditionCd: string;

  @Column({ name: 'fuel_cd_list', nullable: true })
  fuelCdList: string;

  @Column({ name: 'mhhi_indicator', nullable: true })
  mhhiIndicator: number;

  @Column({ name: 'mats_load', nullable: true })
  matsLoad: number;

  @Column({ name: 'mats_startup_shutdown_flg', nullable: true })
  matsStartupShutdownFlg: string;
}
