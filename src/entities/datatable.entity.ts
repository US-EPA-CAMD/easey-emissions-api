import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToOne,  
  PrimaryGeneratedColumn
} from 'typeorm';

import { DataSet } from './dataset.entity';
import { DataColumn } from './datacolumn.entity';

@Entity({ name: 'camdaux.datatable' })
export class DataTable extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'datatable_id',
  })
  id: number;

  @Column({
    name: 'dataset_cd',
  })
  dataSetCode: string;

  @Column({
    name: 'table_order',
  })
  tableOrder: number;

  @Column({
    name: 'display_name',
  })
  displayName: string;

  @Column({
    name: 'sql_statement',
  })
  sqlStatement: string;

  @Column({
    name: 'no_results_msg_override',
  })
  noResultsMessage: string;

  @ManyToOne(
    () => DataSet,
    o => o.tables,
  )
  @JoinColumn({ name: 'dataset_cd' })
  dataSet: DataSet;

  @OneToMany(
    () => DataColumn,
    o => o.dataTable,
  )
  @JoinColumn({ name: 'datatable_id' })
  columns: DataColumn[];
}
