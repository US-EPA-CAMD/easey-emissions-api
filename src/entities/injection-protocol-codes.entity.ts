import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.injection_protocol_code' })
export class InjectionProtocolCode extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'injection_protocol_cd',
  })
  injectionProtocolCode: string;

  @Column({
    type: 'varchar',
    name: 'injection_protocol_description',
  })
  injectionProtocolDescription: string;
}
