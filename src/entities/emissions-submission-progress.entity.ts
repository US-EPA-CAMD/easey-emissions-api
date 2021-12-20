import { ViewEntity, ViewColumn, BaseEntity } from 'typeorm';

@ViewEntity({ name: 'camddmw.vw_emissions_submissions_progress' })
export class EmissionSubmissionsProgress extends BaseEntity {
  @ViewColumn({
    name: 'begin_date',
  })
  beginDate: Date;

  @ViewColumn({
    name: 'end_date',
  })
  endDate: Date;

  @ViewColumn({
    name: 'calendar_year',
  })
  calendarYear: number;

  @ViewColumn({
    name: 'quarter',
  })
  quarter: number;

  @ViewColumn({
    name: 'submitted_percentage',
  })
  submittedPercentage: number;

  @ViewColumn({
    name: 'submitted_count',
  })
  submittedCount: number;

  @ViewColumn({
    name: 'remaining_count',
  })
  remainingCount: number;

  @ViewColumn({
    name: 'total_expected_count',
  })
  totalExpectedCount: number;

  @ViewColumn({
    name: 'gdm_used_percentage',
  })
  gdmUsedPercentage: number;

  @ViewColumn({
    name: 'gdm_used_count',
  })
  gdmUsedCount: number;

  @ViewColumn({
    name: 'gdm_remaining_count',
  })
  gdmRemainingCount: number;
}
