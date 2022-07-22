import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.mats_derived_hrly_value' })
export class MatsDerivedHrlyValue extends BaseEntity {
  @PrimaryColumn({ name: 'mats_dhv_id', nullable: false })
  matsDhvId: string;

  @Column({ nullable: false, name: 'hour_id' })
  hourId: string;

  @Column({ nullable: false, name: 'parameter_cd' })
  parameterCd: string;

  @Column({ name: 'unadjusted_hrly_value', nullable: true })
  unadjustedHrlyValue: string;

  @Column({ name: 'modc_cd', nullable: true })
  modcCd: string;

  @Column({ name: 'mon_form_id', nullable: true })
  monFormId: string;

  @Column({ name: 'calc_unadjusted_hrly_value', nullable: true })
  calcUnadjustedHrlyValue: string;

  @Column({
    name: 'calc_pct_diluent',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcPctDiluent: number;

  @Column({
    name: 'calc_pct_moisture',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcPctMoisture: number;

  @Column({ name: 'mon_loc_id' })
  monLocId: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
    nullable: false,
  })
  rptPeriodId: number;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;
}
