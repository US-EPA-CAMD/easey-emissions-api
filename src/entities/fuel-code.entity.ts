import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.fuel_code' })
export class FuelCode extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'fuel_cd',
  })
  fuelCode: string;

  @Column({
    type: 'varchar',
    name: 'fuel_group_cd',
  })
  fuelGroupCode: string;

  @Column({
    type: 'varchar',
    name: 'unit_fuel_cd',
  })
  unitFuelCode: string;

  @Column({
    type: 'varchar',
    name: 'fuel_cd_description',
  })
  fuelDescription: string;
}
