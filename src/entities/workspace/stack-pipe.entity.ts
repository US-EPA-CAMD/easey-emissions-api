import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { Plant } from './plant.entity';
import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmpswks.stack_pipe' })
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

  @ManyToOne(
    () => Plant,
    o => o.stackPipes,
  )
  @JoinColumn({ name: 'fac_id' })
  plant: Plant;

  @OneToOne(
    () => MonitorLocation,
    o => o.stackPipe,
  )
  @JoinColumn({ name: 'stack_pipe_id' })
  location: MonitorLocation;
}
