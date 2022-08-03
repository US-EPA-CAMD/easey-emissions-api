import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { HrlyOpData } from './hrly-op-data.entity';

@Entity({ name: 'camdecmpswks.mats_derived_hrly_value' })
export class MatsDerivedHrlyValue extends BaseEntity {
  @PrimaryColumn({ name: 'mats_dhv_id', nullable: false })
  id: string;

  @Column({ nullable: false, name: 'hour_id' })
  hourId: string;

  @Column({ nullable: false, name: 'parameter_cd' })
  parameterCode: string;

  @Column({ name: 'unadjusted_hrly_value', nullable: true })
  unadjustedHourlyValue: string;

  @Column({ name: 'modc_cd', nullable: true })
  modcCode: string;

  @Column({ name: 'mon_form_id', nullable: true })
  formulaIdentifier: string;

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

  @Column({ name: 'mon_loc_id', nullable: false })
  monitoringLocationId: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
    nullable: false,
  })
  reportingPeriodId: number;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @ManyToOne(
    () => HrlyOpData,
    o => o.matsDerivedHourlyValues,
  )
  @JoinColumn({ name: 'hour_id' })
  hrlyOpData: HrlyOpData;
}
