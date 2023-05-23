import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.sample_type_code' })
export class SampleTypeCode extends BaseEntity {
  @PrimaryColumn({
    name: 'sample_type_cd',
  })
  sampleTypeCode: string;

  @Column({
    name: 'sample_type_cd_description',
  })
  sampleTypeDescription: string;
}
