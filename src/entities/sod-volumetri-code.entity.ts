import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.sod_volumetric_code' })
export class SodVolumetricCode extends BaseEntity {
  @PrimaryColumn({
    name: 'sod_volumetric_cd',
  })
  sodVolumetricCode: string;

  @Column({
    name: 'sod_volumetric_cd_description',
  })
  sodVolumetricDescription: string;
}
