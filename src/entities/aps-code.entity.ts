import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'camdecmpsmd.aps_code' })
export class ApsCode extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', name: 'aps_cd' })
  apsCode: string;

  @Column({ type: 'varchar', name: 'aps_description' })
  apsCodeDescription: string;
}
