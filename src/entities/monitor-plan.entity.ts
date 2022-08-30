import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Plant } from './plant.entity';
import { MonitorLocation } from './monitor-location.entity';
import { ReportingPeriod } from './reporting-period.entity';
import { EmissionEvaluation } from './emission-evaluation.entity';

@Entity({ name: 'camdecmps.monitor_plan' })
export class MonitorPlan extends BaseEntity {
  @PrimaryColumn({
    name: 'mon_plan_id',
    type: 'varchar',
  })
  id: string;

  @Column({ name: 'fac_id', type: 'numeric' })
  facilityId: number;

  @JoinColumn({ name: 'begin_rpt_period_id' })
  @ManyToOne(
    () => ReportingPeriod,
    rp => rp.id,
  )
  beginRptPeriod: ReportingPeriod;

  @JoinColumn({ name: 'end_rpt_period_id' })
  @ManyToOne(
    () => ReportingPeriod,
    rp => rp.id,
  )
  endRptPeriod: ReportingPeriod;

  @ManyToOne(
    () => Plant,
    o => o.monitorPlans,
  )
  @JoinColumn({ name: 'fac_id' })
  plant: Plant;

  @ManyToMany(
    () => MonitorLocation,
    location => location.monitorPlans,
  )
  @JoinTable({
    name: 'camdecmps.monitor_plan_location',
    joinColumn: {
      name: 'mon_plan_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'mon_loc_id',
      referencedColumnName: 'id',
    },
  })
  locations: MonitorLocation[]; 

  @OneToMany(
    () => EmissionEvaluation,
    o => o.monitorPlan,
  )
  @JoinColumn({ name: 'mon_plan_id' })
  emissionsEvaluations: EmissionEvaluation[];
}
