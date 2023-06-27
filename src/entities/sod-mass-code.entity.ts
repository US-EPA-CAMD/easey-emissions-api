import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.sod_mass_code' })
export class SodMassCode extends BaseEntity {
  @PrimaryColumn({
    name: 'sod_mass_cd',
  })
  sodVolumetricCode: string;

  @Column({
    name: 'sod_mass_cd_description',
  })
  sodMassDescription: string;
}
