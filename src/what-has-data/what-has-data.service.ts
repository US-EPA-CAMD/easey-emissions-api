import { Injectable } from '@nestjs/common';

import { EmissionsRepository } from '../emissions/emissions.repository';
import { EmissionsDataTypes } from '../enums/emissions-data-types.enum';

const commonSQL = (schema: string) => {
  return `
    JOIN ${schema}.monitor_plan_location mpl USING (mon_loc_id)
      JOIN (
        SELECT mon_plan_id, string_agg(unit_stack, ', ') AS configuration
        FROM (
          SELECT mon_plan_id, COALESCE(unitid, stack_name) AS unit_stack
          FROM ${schema}.monitor_plan_location mpl
          JOIN ${schema}.monitor_location ml USING(mon_loc_id)
          LEFT JOIN ${schema}.stack_pipe USING(stack_pipe_id)
          LEFT JOIN camd.unit USING(unit_id)
          ORDER BY mon_plan_id, unitid, stack_name
        ) AS d1
        GROUP BY mon_plan_id
      ) AS d USING(mon_plan_id)
    JOIN ${schema}.monitor_plan mp USING(mon_plan_id)
    JOIN camd.plant p USING(fac_id)
    WHERE end_rpt_period_id IS NULL
    ORDER BY oris_code, configuration, period_abbreviation`;
};

@Injectable()
export class WhatHasDataService {
  constructor(private readonly repository: EmissionsRepository) {}

  async whatHasData(
    dataType: EmissionsDataTypes,
    isWorkspace: boolean = false,
  ): Promise<any> {
    let sql = null;
    const schema = isWorkspace ? 'camdecmpswks' : 'camdecmps';

    if (dataType === EmissionsDataTypes.DAILY_CAL) {
      sql = `
        SELECT DISTINCT
          oris_code AS "orisCode",
          facility_name AS "facilityName",
          configuration,
          period_abbreviation AS "yearQuarter"
        FROM ${schema}.${dataType}
        JOIN ${schema}.daily_test_summary sum USING (daily_test_sum_id)
        JOIN camdecmpsmd.reporting_period rp ON sum.rpt_period_id = rp.rpt_period_id
        ${commonSQL(schema)}`;
    } else {
      sql = `
        SELECT DISTINCT
          oris_code AS "orisCode",
          facility_name AS "facilityName",
          configuration,
          period_abbreviation AS "yearQuarter"
        FROM ${schema}.${dataType}
        JOIN camdecmpsmd.reporting_period USING (rpt_period_id)
        ${commonSQL(schema)}`;
    }

    return this.repository.query(sql);
  }
}
