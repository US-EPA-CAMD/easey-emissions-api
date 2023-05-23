import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.gas_level_code' })
export class GasLevelCode extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'gas_level_cd',
  })
  gasLevelCode: string;

  @Column({
    type: 'varchar',
    name: 'gas_level_description',
  })
  gasLevelCodeDescription: string;

  @Column({
    type: 'varchar',
    name: 'cal_category',
  })
  calCategory: string;
}
