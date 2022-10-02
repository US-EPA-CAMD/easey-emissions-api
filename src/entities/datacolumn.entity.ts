import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { DataTable } from './datatable.entity';

@Entity({ name: 'camdaux.datacolumn' })
export class DataColumn extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'datacolumn_id',
  })
  id: number;

  @Column({
    name: 'datatable_id',
  })
  dataTableId: number;  

  @Column({
    name: 'column_order',
  })
  columnOrder: number;

  @Column({
    name: 'name',
  })
  name: string;

  @Column({
    name: 'alias',
  })
  alias: string;

  @Column({
    name: 'display_name',
  })
  displayName: string;

  @ManyToOne(
    () => DataTable,
    o => o.columns,
  )
  @JoinColumn({ name: 'datatable_id' })
  dataTable: DataTable;
}
