import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DailyTestSummary } from './daily-test-summary.entity';

@Entity({ name: 'camdecmps.component' })
export class Component extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'component_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  monLocId: string;

  @Column({
    type: 'varchar',
    length: 3,
    nullable: false,
    name: 'component_identifier',
  })
  componentID: string;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
    name: 'model_version',
  })
  modelVersion: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    name: 'serial_number',
  })
  serialNumber: string;

  @Column({
    type: 'varchar',
    length: 25,
    nullable: true,
    name: 'manufacturer',
  })
  manufacturer: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: false,
    name: 'component_type_cd',
  })
  componentTypeCode: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: true,
    name: 'acq_cd',
  })
  acqCode: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: true,
    name: 'basis_cd',
  })
  basisCode: string;

  @Column({
    type: 'varchar',
    length: 25,
    nullable: true,
    name: 'userid',
  })
  userId: string;

  @Column({
    type: 'date',
    nullable: true,
    name: 'add_date',
  })
  addDate: Date;

  @Column({
    type: 'date',
    nullable: true,
    name: 'update_date',
  })
  updateDate: Date;

  @Column({
    type: 'numeric',
    precision: 1,
    scale: 0,
    name: 'hg_converter_ind',
    transformer: new NumericColumnTransformer(),
  })
  hgConverterIndicator: number;

  @OneToMany(
    () => DailyTestSummary,
    c => c.component,
  )
  @JoinColumn({ name: 'component_id' })
  dailyTestSummaries: DailyTestSummary[];

}
