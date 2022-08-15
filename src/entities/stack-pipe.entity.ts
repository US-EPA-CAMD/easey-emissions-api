import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmps.stack_pipe' })
export class StackPipe extends BaseEntity {
  @PrimaryColumn({
    name: 'stack_pipe_id',
  })
  id: string;

  @Column({
    name: 'stack_name',
  })
  name: string;

  @Column({
    type: 'date',
    name: 'active_date',
  })
  activeDate: Date;

  @Column({
    type: 'date',
    name: 'retire_date',
  })
  retireDate: Date;

  @Column({
    name: 'fac_id',
    transformer: new NumericColumnTransformer(),
  })
  facId: number;

  @OneToOne(
    () => MonitorLocation,
    location => location.stackPipe,
  )
  location: MonitorLocation;
}