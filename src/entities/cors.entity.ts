import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdaux.cors' })
export class Cors extends BaseEntity {
  @PrimaryColumn({
    name: 'cors_id',
  })
  id: number;

  @Column({
    name: 'key',
  })
  key: string;

  @Column({
    name: 'value',
  })
  value: string;

  @Column({
    name: 'api',
  })
  api?: string;
}
