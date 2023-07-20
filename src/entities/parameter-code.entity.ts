import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.parameter_code' })
export class ParameterCode extends BaseEntity {
  @PrimaryColumn({
    name: 'parameter_cd',
  })
  parameterCode: string;

  @Column({
    name: 'parameter_cd_description',
  })
  parameterDescription: string;
}
