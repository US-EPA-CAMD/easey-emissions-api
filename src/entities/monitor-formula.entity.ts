import { BaseEntity, Entity, Column, PrimaryColumn, OneToMany, JoinColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { DerivedHrlyValue } from './derived-hrly-value.entity';
import { MatsDerivedHrlyValue } from './mats-derived-hrly-value.entity';

@Entity({ name: 'camdecmps.monitor_formula' })
export class MonitorFormula extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'mon_form_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  locationId: string;

  @Column({ type: 'varchar', length: 7, nullable: false, name: 'parameter_cd' })
  parameterCode: string;

  @Column({ type: 'varchar', length: 7, nullable: true, name: 'equation_cd' })
  formulaCode: string;

  @Column({
    type: 'varchar',
    length: 3,
    nullable: true,
    name: 'formula_identifier',
  })
  formulaId: string;

  @Column({ type: 'date', nullable: true, name: 'begin_date' })
  beginDate: Date;

  @Column({
    nullable: true,
    name: 'begin_hour',
    transformer: new NumericColumnTransformer(),
  })
  beginHour: number;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({
    nullable: true,
    name: 'end_hour',
    transformer: new NumericColumnTransformer(),
  })
  endHour: number;

  @Column({
    type: 'varchar',
    length: 200,
    name: 'formula_equation',
  })
  formulaText: string;

  @Column({ type: 'varchar', length: 8, nullable: false, name: 'userid' })
  userId: string;

  @Column({ type: 'date', nullable: true, name: 'add_date' })
  addDate: Date;

  @Column({ type: 'date', nullable: true, name: 'update_date' })
  updateDate: Date;

  @OneToMany(
    () => DerivedHrlyValue,
    c => c.formula,
  )
  @JoinColumn({ name: 'mon_form_id' })
  derivedHrlyValues: DerivedHrlyValue[];

  @OneToMany(
    () => MatsDerivedHrlyValue,
    c => c.formula,
  )
  @JoinColumn({ name: 'mon_form_id' })
  matsDerivedHrlyValues: MatsDerivedHrlyValue[];

}
