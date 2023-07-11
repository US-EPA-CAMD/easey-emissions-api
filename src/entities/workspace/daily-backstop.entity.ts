import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { MonitorLocation } from './monitor-location.entity';
import { ReportingPeriod } from './reporting-period.entity';

@Entity({ name: 'camdecmps.daily_backstop' })
export class DailyBackstop extends BaseEntity {
    @PrimaryColumn({
        name: 'daily_backstop_id',
        nullable: false,
    })
    id: string;

    @Column({
        nullable: false,
        type: 'date',
        name: 'op_date',
    })
    date: Date;

    @Column({
        nullable: false,
        name: 'daily_noxm',
        transformer: new NumericColumnTransformer(),
        precision: 10,
        scale: 1,
    })
    dailyNoxEmissions: number;

    @Column({
        nullable: false,
        name: 'daily_hit',
        transformer: new NumericColumnTransformer(),
        precision: 10,
        scale: 1,
    })
    dailyHeatInput: number;

    @Column({
        nullable: true,
        name: 'daily_avg_noxr',
        transformer: new NumericColumnTransformer(),
        precision: 7,
        scale: 3,
    })
    dailyAverageNoxRate: number;

    @Column({
        nullable: false,
        name: 'daily_noxm_exceed',
        transformer: new NumericColumnTransformer(),
        precision: 10,
        scale: 1,
    })
    dailyNoxExceedence: number;

    @Column({
        nullable: true,
        name: 'cumulative_os_noxm_exceed',
        transformer: new NumericColumnTransformer(),
        precision: 13,
        scale: 1,
    })
    cumulativeOsNoxExceedence: number;

    @Column({
        nullable: false,
        name: 'mon_loc_id',
    })
    monitoringLocationId: string;

    @Column({
        nullable: false,
        name: 'rpt_period_id',
        transformer: new NumericColumnTransformer(),
    })
    reportingPeriodId: number;

    @Column({
        name: 'userid',
        nullable: false,
    })
    userId: string;

    @Column({
        name: 'add_date',
        nullable: false,
    })
    addDate: Date;

    @Column({
        name: 'update_date',
        nullable: true,
    })
    updateDate: Date;

    @ManyToOne(
        () => MonitorLocation,
        o => o.dailyBackstops,
    )
    @JoinColumn({ name: 'mon_loc_id' })
    monitorLocation: MonitorLocation;

    @ManyToOne(
        () => ReportingPeriod,
        o => o.dailyBackstops,
    )
    @JoinColumn({ name: 'rpt_period_id' })
    reportingPeriod: ReportingPeriod;
}
