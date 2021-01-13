import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.fuel_type_code' })
export class FuelTypeCode extends BaseEntity {
  @PrimaryColumn({
    name: 'fuel_type_cd',
  })
  fuelTypeCd: string;

  @Column({
    name: 'fuel_type_description',
  })
  fuelTypeDescription: string;
}
