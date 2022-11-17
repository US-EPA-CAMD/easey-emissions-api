import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { DataTable } from './datatable.entity';

@Entity({ name: 'camdaux.dataset' })
export class DataSet extends BaseEntity {
  @PrimaryColumn({
    name: 'dataset_cd',
  })
  code: string;

  @Column({
    name: 'template_cd',
  })
  templateCode: string;

  @Column({
    name: 'display_name',
  })
  displayName: string;

  @Column({
    name: 'sort_order',
  })
  sortOrder: number;

  @Column({
    name: 'no_results_msg',
  })
  noResultsMessage: string;

  @OneToMany(
    () => DataTable,
    o => o.dataSet,
  )
  @JoinColumn({ name: 'dataset_cd' })
  tables: DataTable[];
}
