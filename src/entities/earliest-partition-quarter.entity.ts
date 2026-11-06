import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { ReportingPeriod } from './reporting-period.entity';

@Entity({ name: 'camdecmpsmd.earliest_partition_quarter' })
export class EarliestPartitionQuarter extends BaseEntity {

    @PrimaryColumn({ name: 'earliest_partition_quarter_id', nullable: false })
    earliestPartitionQuarterId: number;

    @Column({ name: 'table_name', nullable: false })
    tableName: string;

    @Column({
        name: 'rpt_period_id',
        transformer: new NumericColumnTransformer(),
        type: 'numeric',
        nullable: false,
    })
    reportingPeriodId: number;

    @ManyToOne(
        () => ReportingPeriod,
        { eager: true },
    )
    @JoinColumn({ name: 'rpt_period_id' })
    reportingPeriod: ReportingPeriod;

}
