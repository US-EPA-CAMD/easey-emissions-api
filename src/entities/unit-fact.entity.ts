import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camddmw.unit_fact' })
export class UnitFact extends BaseEntity {
  @PrimaryColumn({
    name: 'unit_id',
  })
  id: number;

  @PrimaryColumn({
    name: 'op_year',
  })
  opYear: number;

  @Column({
    name: 'facility_name',
  })
  facilityName: string;

  @Column({
    name: 'orispl_code',
  })
  orisplCode: number;

  @Column()
  unitid: string;

  @Column()
  state: string;

  @Column({
    name: 'primary_fuel_info',
  })
  primaryFuelInfo: string;

  @Column({
    name: 'secondary_fuel_info',
  })
  secondaryFuelInfo: string;

  @Column({
    name: 'unit_type_info',
  })
  unitTypeInfo: string;

  @Column({
    name: 'so2_control_info',
  })
  so2ControlInfo: string;

  @Column({
    name: 'nox_control_info',
  })
  noxControlInfo: string;

  @Column({
    name: 'part_control_info',
  })
  partControlInfo: string;

  @Column({
    name: 'hg_control_info',
  })
  hgControlInfo: string;
}
