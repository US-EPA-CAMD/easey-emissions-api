import { ViewEntity, ViewColumn, BaseEntity } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

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
    transformer: new NumericColumnTransformer(),    
  })
  calendarYear: number;

  @ViewColumn({
    name: 'quarter',
    transformer: new NumericColumnTransformer(),    
  })
  quarter: number;

  @ViewColumn({
    name: 'submitted_percentage',
    transformer: new NumericColumnTransformer(),    
  })
  submittedPercentage: number;

  @ViewColumn({
    name: 'submitted_count',
    transformer: new NumericColumnTransformer(),    
  })
  submittedCount: number;

  @ViewColumn({
    name: 'remaining_count',
    transformer: new NumericColumnTransformer(),    
  })
  remainingCount: number;

  @ViewColumn({
    name: 'total_expected_count',
    transformer: new NumericColumnTransformer(),    
  })
  totalExpectedCount: number;

  @ViewColumn({
    name: 'gdm_used_percentage',
    transformer: new NumericColumnTransformer(),    
  })
  gdmUsedPercentage: number;

  @ViewColumn({
    name: 'gdm_used_count',
    transformer: new NumericColumnTransformer(),    
  })
  gdmUsedCount: number;

  @ViewColumn({
    name: 'gdm_remaining_count',
    transformer: new NumericColumnTransformer(),    
  })
  gdmRemainingCount: number;
}
