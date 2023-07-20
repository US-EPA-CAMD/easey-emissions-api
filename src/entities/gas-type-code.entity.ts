import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.gas_type_code' })
export class GasTypeCode extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'gas_type_cd',
  })
  gasTypeCode: string;

  @Column({
    type: 'varchar',
    name: 'gas_type_description',
  })
  gasTypeCodeDescription: string;
}
