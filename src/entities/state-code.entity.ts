import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdmd.state_code' })
export class StateCode extends BaseEntity {
  @PrimaryColumn({
    name: 'state_cd',
  })
  stateCode: string;

  @Column({
    name: 'state_name',
  })
  stateName: string;
}
