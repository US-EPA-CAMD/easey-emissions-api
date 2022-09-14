import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn
} from 'typeorm';

import { Datatable } from './datatable.entity';

@Entity({ name: 'camdecmpsaux.dataset' })
export class Dataset extends BaseEntity {
  @PrimaryColumn({
    name: 'dataset_cd',
  })
  code: string;

  @Column({
    name: 'display_name',
  })
  displayName: string;

  @Column({
    name: 'template_cd',
  })
  templateCode: string;

  @Column({
    name: 'no_results_msg',
  })
  noResultsMessage: string;

  @OneToMany(
    () => Datatable,
    o => o.dataset,
  )
  @JoinColumn({ name: 'dataset_cd' })
  datatables: Datatable[];
}
