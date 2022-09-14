import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { Datatable } from './datatable.entity';

@Entity({ name: 'camdecmpsaux.datacolumn' })
export class Datacolumn extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'datacolumn_id',
  })
  id: number;

  @Column({
    name: 'column_order',
  })
  columnOrder: number;

  @Column({
    name: 'name',
  })
  name: string;

  @Column({
    name: 'display_name',
  })
  displayName: string;

  @Column({
    name: 'datatable_id',
  })
  datatableId: number;

  @ManyToOne(
    () => Datatable,
    o => o.columns,
  )
  @JoinColumn({ name: 'datatable_id' })
  datatable: Datatable;
}
