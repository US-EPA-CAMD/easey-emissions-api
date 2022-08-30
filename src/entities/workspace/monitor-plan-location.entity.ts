import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpswks.monitor_plan_location' })
export class MonitorPlanLocation extends BaseEntity {
  @PrimaryColumn({
    name: 'monitor_plan_location_id',
  })
  id: string;

  @Column({
    name: 'mon_plan_id',
  })
  monitorPlanId: string;

  @Column({
    name: 'mon_loc_id',
  })
  monitoringLocationId: string;
}
