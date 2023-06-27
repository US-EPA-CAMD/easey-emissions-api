import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.nsps4t_emission_standard_code' })
export class Nsps4tEmissionStandardCode extends BaseEntity {
  @PrimaryColumn({
    name: 'emission_standard_cd',
  })
  emissionStandardCode: string;

  @Column({
    name: 'emission_standard_description',
  })
  emissionStandardDescription: string;

  @Column({
    name: 'emission_standard_uom_cd',
  })
  emissionStandardUomCode: string;

  @Column({
    name: 'emission_standard_load_cd',
  })
  emissionStandardLoadCode: string;
}
