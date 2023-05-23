import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.units_of_measure_code' })
export class UnitsOfMeasureCode extends BaseEntity {
  @PrimaryColumn({
    name: 'uom_cd',
  })
  uom_cd: string;

  @Column({
    name: 'uom_cd_description',
  })
  uomDescription: string;
}
