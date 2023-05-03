import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.operating_condition_code' })
export class OperatingConditionCode extends BaseEntity {
  @PrimaryColumn({
    name: 'operating_condition_cd',
  })
  operatingConditionCode: string;

  @Column({
    name: 'op_condition_cd_description',
  })
  operatingConditionDescription: string;
}
