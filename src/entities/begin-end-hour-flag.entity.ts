import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'camdecmpsmd.begin_end_hour_flag'})
export class BeginEndHourFlag extends BaseEntity {
  @PrimaryColumn({ name: 'begin_end_hour_flg', nullable: false })
  id: string;

  @Column({ name: 'begin_end_hour_description', nullable: false })
  descripton: string;
}