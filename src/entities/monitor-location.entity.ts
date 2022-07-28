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
import { HrlyOpData } from './hrly-op-data.entity';
    
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

    // @OneToOne(
    //   () => StackPipe,
    //   stackPipe => stackPipe.location,
    //   { eager: true },
    // )
    // @JoinColumn({ name: 'stack_pipe_id' })
    // stackPipe: StackPipe;
  
    // @OneToOne(
    //   () => Unit,
    //   unit => unit.location,
    //   { eager: true },
    // )
    // @JoinColumn({ name: 'unit_id' })
    // unit: Unit;
  
    // @OneToMany(
    //   () => Component,
    //   c => c.location,
    // )
    // @JoinColumn({ name: 'mon_loc_id' })
    // components: Component[];
  
    // @OneToMany(
    //   () => MonitorSystem,
    //   ms => ms.location,
    // )
    // @JoinColumn({ name: 'mon_loc_id' })
    // systems: MonitorSystem[];
  
    // @OneToMany(
    //   () => TestSummary,
    //   ts => ts.location,
    // )
    // @JoinColumn({ name: 'mon_loc_id' })
    // testSummaries: TestSummary[];
  }
  