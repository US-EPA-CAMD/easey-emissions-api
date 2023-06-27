import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.modc_code' })
export class ModcCode extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'modc_cd',
  })
  injectionProtocolCode: string;

  @Column({
    type: 'varchar',
    name: 'modc_description',
  })
  modc_description: string;
}
