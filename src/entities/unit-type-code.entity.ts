import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdmd.unit_type_code' })
export class UnitTypeCode extends BaseEntity {
  @PrimaryColumn({
    name: 'unit_type_cd',
  })
  unitTypeCode: string;

  @Column({
    name: 'unit_type_description',
  })
  unitTypeDescription: string;
}
