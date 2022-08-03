import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmpswks.summary_value' })
export class SummaryValue extends BaseEntity {
  @PrimaryColumn({
    name: 'sum_value_id',
    nullable: false,
  })
  id: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
    nullable: false,
  })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id', nullable: false })
  monLocId: string;

  @Column({ name: 'parameter_cd', nullable: false })
  parameterCode: string;

  @Column({
    name: 'current_rpt_period_total',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  currentRptPeriodTotal: number;

  @Column({
    name: 'calc_current_rpt_period_total',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcCurrentRptPeriodTotal: number;

  @Column({
    name: 'os_total',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  osTotal: number;

  @Column({
    name: 'calc_os_total',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcOsTotal: number;

  @Column({
    name: 'year_total',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  yearTotal: number;

  @Column({
    name: 'calc_year_total',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  calcYearTotal: number;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;
}
