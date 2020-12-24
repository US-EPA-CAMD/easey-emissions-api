import {
    BaseEntity,
    Column,
    Entity,
    PrimaryColumn,
  } from 'typeorm';
  
  @Entity({ name: 'camdmd.state_code' })
  export class StateCode extends BaseEntity {
    @PrimaryColumn({
      name: 'state_cd',
    })
    stateCd: string;

    @Column({
      name: 'state_name',
    })
    stateName: string;
  }