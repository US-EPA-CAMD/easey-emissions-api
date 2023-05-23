import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.test_type_code' })
export class TestTypeCode extends BaseEntity {
  @PrimaryColumn({
    name: 'test_type_cd',
  })
  testTypeCode: string;

  @Column({
    name: 'test_type_cd_description',
  })
  testTypeDescription: string;
}
