import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToOne,  
  PrimaryGeneratedColumn
} from 'typeorm';

import { Dataset } from './dataset.entity';
import { Datacolumn } from './datacolumn.entity';

@Entity({ name: 'camdecmpsaux.datatable' })
export class Datatable extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'datatable_id',
  })
  id: number;

  @Column({
    name: 'dataset_cd',
  })
  datasetCode: string;

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
    () => Dataset,
    o => o.datatables,
  )
  @JoinColumn({ name: 'dataset_cd' })
  dataset: Dataset;

  @OneToMany(
    () => Datacolumn,
    o => o.datatable,
  )
  @JoinColumn({ name: 'datatable_id' })
  columns: Datacolumn[];
}
