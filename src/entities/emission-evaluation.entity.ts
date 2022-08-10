import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { MonitorPlan } from './monitor-plan.entity';
import { ReportingPeriod } from './reporting-period.entity';

@Entity({ name: 'camdecmps.emission_evaluation' })
export class EmissionEvaluation extends BaseEntity {
  @PrimaryColumn({ name: 'mon_plan_id', nullable: false })
  monPlanId: string;

  @PrimaryColumn({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
    nullable: false,
  })
  reportingPeriodId: number;

  @Column({ name: 'last_updated', nullable: true })
  lastUpdated: Date;

  @Column({ name: 'updated_status_flg', nullable: true })
  updatedStatusFlg: string;

  @Column({ name: 'needs_eval_flg', nullable: true })
  needsEvalFlag: string;

  @Column({ name: 'chk_session_id', nullable: true })
  chkSessionId: string;

  @Column({
    name: 'submission_id',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  submissionId: number;

  @Column({ name: 'submission_availability_cd', nullable: true })
  submissionAvailabilityCd: string;

  @ManyToOne(
    () => ReportingPeriod,
    o => o.emissionEvaluations,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  reportingPeriod: ReportingPeriod;

  @ManyToOne(
    () => MonitorPlan,
    o => o.emissionsEvaluations,
  )
  @JoinColumn({ name: 'mon_plan_id' })
  plan: MonitorPlan;
}
