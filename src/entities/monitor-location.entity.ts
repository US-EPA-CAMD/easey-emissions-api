import { DataRowMessage } from 'pg-protocol/dist/messages';
import {
    BaseEntity,
    Column,
    Entity,
    PrimaryColumn,
    JoinColumn,
    OneToMany,
  } from 'typeorm';
import { DailyEmission } from './daily-emission.entity';
import { DailyTestSummary } from './daily-test-summary.entity';
import { HrlyGasFlowMeter } from './hrly-gas-flow-meter.entity';
import { HrlyOpData } from './hrly-op-data.entity';
import { LongTermFuelFlow } from './long-term-fuel-flow.entity';
import { MatsDerivedHrlyValue } from './mats-derived-hrly-value.entity';
import { MatsMonitorHrlyValue } from './mats-monitor-hrly-value.entity';
import { Nsps4tAnnual } from './nsps4t-annual.entity';
import { Nsps4tSummary } from './nsps4t-summary.entity';
import { SummaryValue } from './summary-value.entity';
    
  @Entity({ name: 'camdecmps.monitor_location' })
  export class MonitorLocation extends BaseEntity {
    @PrimaryColumn({
      name: 'mon_loc_id',
    })
    id: string;
  
    @Column({
      name: 'unit_id',
      nullable: true,
    })
    unitId: string;
  
    @Column({
      name: 'stack_pipe_id',
      nullable: true,
    })
    stackPipeId: string;
    
    @Column({
        name: 'userid',
        nullable: true,
    })
    userId: string;

    @Column({
        name: 'userid',
        nullable: true,
        type: 'date',
    })
    addDate: Date;

    @Column({
        name: 'userid',
        nullable: true,
        type: 'date',
    })
    updateDate: Date;

    @OneToMany(
      () => DailyEmission,
      c => c.location,
    )
    @JoinColumn({ name: 'mon_loc_id' })
    dailyEmissions: DailyEmission[];

    @OneToMany(
      () => DailyEmission,
      c => c.location,
    )
    @JoinColumn({ name: 'mon_loc_id' })
    hrlyOpData: HrlyOpData[];

    @OneToMany(
      () => Nsps4tSummary,
      c => c.location,
    )
    @JoinColumn({ name: 'mon_loc_id' })
    nsps4tSummaries: Nsps4tSummary[];

    @OneToMany(
      () => SummaryValue,
      c => c.location,
    )
    @JoinColumn({ name: 'mon_loc_id' })
    summaryValues: SummaryValue[];

    @OneToMany(
      () => DailyTestSummary,
      c => c.location,
    )
    @JoinColumn({ name: 'mon_loc_id' })
    dailyTestSummaries: DailyTestSummary[];

    @OneToMany(
      () => LongTermFuelFlow,
      c => c.location,
    )
    @JoinColumn({ name: 'mon_loc_id' })
    longTermFuelFlows: LongTermFuelFlow[];

    @OneToMany(
      () => HrlyGasFlowMeter,
      c => c.location,
    )
    @JoinColumn({ name: 'mon_loc_id' })
    hrlyGasFlowMeters: HrlyGasFlowMeter[];

    @OneToMany(
      () => MatsDerivedHrlyValue,
      c => c.location,
    )
    @JoinColumn({ name: 'mon_loc_id' })
    matsDerivedHrlyValues: MatsDerivedHrlyValue[];

    @OneToMany(
      () => MatsMonitorHrlyValue,
      c => c.location,
    )
    @JoinColumn({ name: 'mon_loc_id' })
    matsMonitorHrlyValues: MatsMonitorHrlyValue[];

    @OneToMany(
      () => Nsps4tAnnual,
      c => c.location,
    )
    @JoinColumn({ name: 'mon_loc_id' })
    nsps4tAnnuals: Nsps4tAnnual[];


  }
  