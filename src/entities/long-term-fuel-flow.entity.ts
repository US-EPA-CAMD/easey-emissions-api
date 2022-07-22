import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.long_term_fuel_flow' })
export class LongTermFuelFlow extends BaseEntity {
  @PrimaryColumn({ name: 'ltff_id' })
  ltffId: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  rptPeriodId: number | null;

  @Column({ name: 'mon_loc_id' })
  monLocId: string | null;

  @Column({ name: 'mon_sys_id' })
  monSysId: string | null;

  @Column({ name: 'fuel_flow_period_cd' })
  fuelFlowPeriodCd: string | null;

  @Column({
    name: 'long_term_fuel_flow_value',
    transformer: new NumericColumnTransformer(),
  })
  longTermFuelFlowValue: number | null;

  @Column({ name: 'ltff_uom_cd' })
  ltffUomCd: string | null;

  @Column({
    name: 'gross_calorific_value',
    transformer: new NumericColumnTransformer(),
  })
  grossCalorificValue: number | null;

  @Column({ name: 'gcv_uom_cd' })
  gcvUomCd: string | null;

  @Column({
    name: 'total_heat_input',
    transformer: new NumericColumnTransformer(),
  })
  totalHeatInput: number | null;

  @Column({
    name: 'calc_total_heat_input',
    transformer: new NumericColumnTransformer(),
  })
  calcTotalHeatInput: number | null;

  @Column({ name: 'userid' })
  userId: string | null;

  @Column({ name: 'add_date' })
  addDate: Date | null;

  @Column({ name: 'update_date' })
  updateDate: Date | null;
}
