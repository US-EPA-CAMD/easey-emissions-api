import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmps.monitor_plan_location' })
export class MonitorPlanLocation extends BaseEntity {
  @PrimaryColumn({
    name: 'monitor_plan_location_id',
  })
  id: string;

  @Column({
    name: 'mon_plan_id',
  })
  planId: string;

  @Column({
    name: 'mon_loc_id',
  })
  locationId: string;
}