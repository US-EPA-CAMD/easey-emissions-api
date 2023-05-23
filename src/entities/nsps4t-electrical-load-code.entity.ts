import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.nsps4t_electrical_load_code' })
export class Nsps4tElectricalLoadCode extends BaseEntity {
  @PrimaryColumn({
    name: 'electrical_load_cd',
  })
  electricalLoadCode: string;

  @Column({
    name: 'electrical_load_description',
  })
  electricalLoadDescription: string;
}
