import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { UnitFact } from './unit-fact.entity';

@Entity({ name: 'camddmw.program_year_dim' })
export class ProgramYearDim extends BaseEntity {
  @PrimaryColumn({
    name: 'unit_id',
    transformer: new NumericColumnTransformer(),
  })
  id: number;

  @PrimaryColumn({
    name: 'op_year',
    transformer: new NumericColumnTransformer(),
  })
  year: number;

  @PrimaryColumn({
    name: 'prg_code',
  })
  programCode: string;

  @Column({
    name: 'report_freq',
  })
  reportingFrequency: string;

  @ManyToOne(
    () => UnitFact,
    uf => uf.programYearDim,
  )
  @JoinColumn([
    {
      name: 'unit_id',
      referencedColumnName: 'id',
    },
    {
      name: 'op_year',
      referencedColumnName: 'year',
    },
  ])
  unitFact: UnitFact;
}
