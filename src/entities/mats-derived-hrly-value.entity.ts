import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.mats_derived_hrly_value' })
export class MatsDerivedHrlyValue extends BaseEntity {
  @PrimaryColumn({ name: 'mats_dhv_id' })
  matsDhvId: string;

  @Column({ name: 'hour_id' })
  hourId: string;

  @Column({ name: 'parameter_cd' })
  parameterCd: string;

  @Column({ name: 'unadjusted_hrly_value' })
  unadjustedHrlyValue: string | null;

  @Column({ name: 'modc_cd' })
  modcCd: string | null;

  @Column({ name: 'mon_form_id' })
  monFormId: string | null;

  @Column({ name: 'calc_unadjusted_hrly_value' })
  calcUnadjustedHrlyValue: string | null;

  @Column({
    name: 'calc_pct_diluent',
    transformer: new NumericColumnTransformer(),
  })
  calcPctDiluent: number | null;

  @Column({
    name: 'calc_pct_moisture',
    transformer: new NumericColumnTransformer(),
  })
  calcPctMoisture: number | null;

  @Column({ name: 'mon_loc_id' })
  monLocId: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  rptPeriodId: number;

  @Column({ name: 'userid' })
  userId: string | null;

  @Column({ name: 'add_date' })
  addDate: Date | null;

  @Column({ name: 'update_date' })
  updateDate: Date | null;
}
