import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.control_code' })
export class ControlCode extends BaseEntity {
  @PrimaryColumn({
    name: 'control_cd',
  })
  controlCd: string;

  @Column({
    name: 'control_description',
  })
  controlDescription: string;
}
