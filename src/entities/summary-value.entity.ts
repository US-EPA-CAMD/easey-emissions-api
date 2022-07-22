import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.summary_value' })
export class SummaryValue extends BaseEntity {
  @PrimaryColumn({
    name: 'sum_value_id',
  })
  sumValueId: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  rptPeriodId: number;

  @Column({ name: 'mon_loc_id' })
  monLocId: string;

  @Column({ name: 'parameter_cd' })
  parameterCd: string;

  @Column({
    name: 'current_rpt_period_total',
    transformer: new NumericColumnTransformer(),
  })
  currentRptPeriodTotal: number | null;

  @Column({
    name: 'calc_current_rpt_period_total',
    transformer: new NumericColumnTransformer(),
  })
  calcCurrentRptPeriodTotal: number | null;

  @Column({ name: 'os_total', transformer: new NumericColumnTransformer() })
  osTotal: number | null;

  @Column({
    name: 'calc_os_total',
    transformer: new NumericColumnTransformer(),
  })
  calcOsTotal: number | null;

  @Column({ name: 'year_total', transformer: new NumericColumnTransformer() })
  yearTotal: number | null;

  @Column({
    name: 'calc_year_total',
    transformer: new NumericColumnTransformer(),
  })
  calcYearTotal: number | null;

  @Column({ name: 'userid' })
  userId: string | null;

  @Column({ name: 'add_date' })
  addDate: Date | null;

  @Column({ name: 'update_date' })
  updateDate: Date | null;
}
