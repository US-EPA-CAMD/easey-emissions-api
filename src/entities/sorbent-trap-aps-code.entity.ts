import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.sorbent_trap_aps_code' })
export class SorbentTrapApsCode extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 7, name: 'sorbent_trap_aps_cd' })
  apsCode: string;

  @Column({
    type: 'varchar',
    name: ' sorbent_trap_aps_description',
  })
  apsDescription: string;
}
