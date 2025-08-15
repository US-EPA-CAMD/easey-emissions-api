import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions/easey.exception';
import { EntityManager, In } from 'typeorm';

import { EmissionsReviewDTO } from '../dto/emissions-review.dto';
import { EmissionsReviewEvaluate } from '../entities/workspace/emissions-review-evaluate.entity';
import { EmissionsReviewReport } from '../entities/workspace/emissions-review-report.entity';
import { EmissionsReviewReportGlobal } from '../entities/emissions-review-report.entity';
import { EmissionsReviewSubmit } from '../entities/workspace/emissions-review-submit.entity';
import { EmissionsRetrievalMode } from '../enums/emissions-retrieval-mode.enum';
import { EmissionsReviewMap } from '../maps/emissions-review.map';

@Injectable()
export class ReviewSubmitService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly map: EmissionsReviewMap,
  ) {}

  async getEmissionsRecords({
    orisCodes,
    monPlanIds,
    quarters,
    isWorkspace = false,
    mode = EmissionsRetrievalMode.REPORT, // Indicates the type of data to retrieve
  }: {
    orisCodes: number[],
    monPlanIds: string[],
    quarters: string[],
    isWorkspace?: boolean,
    mode?: EmissionsRetrievalMode,
  }): Promise<EmissionsReviewDTO[]> {

    const entity = (() => {
      switch (mode) {
        case EmissionsRetrievalMode.REPORT:
          return isWorkspace ? EmissionsReviewReport : EmissionsReviewReportGlobal;
        case EmissionsRetrievalMode.EVALUATE:
          if (!isWorkspace) {
            throw new EaseyException(
              new Error('Evaluate mode only applicable for workspace.'),
              HttpStatus.BAD_REQUEST,
            );
          }
          return EmissionsReviewEvaluate;
        case EmissionsRetrievalMode.SUBMIT:
          if (!isWorkspace) {
            throw new EaseyException(
              new Error('Submit mode only applicable for workspace.'),
              HttpStatus.BAD_REQUEST,
            );
          }
          return EmissionsReviewSubmit;
        default:
          throw new EaseyException(
            new Error(`Mode ${mode} not implemented.`),
            HttpStatus.BAD_REQUEST,
          );
      }
    })();

    let data: EmissionsReviewDTO[];

    const hasMonPlanIds = monPlanIds && monPlanIds.length > 0;
    const hasQuarters = quarters && quarters.length > 0;

    try {
      if (hasMonPlanIds && hasQuarters) {
        data = await this.map.many(
          await this.entityManager.find(entity, { where: { monPlanId: In(monPlanIds), periodAbbreviation: In(quarters), }, }),
        );
      } else if (hasMonPlanIds) {
         data = await this.map.many(
          await this.entityManager.find(entity, { where: { monPlanId: In(monPlanIds), }, }),
        );
      } else if (hasQuarters) {
         data = await this.map.many(
          await this.entityManager.find(entity, { where: { orisCode: In(orisCodes), periodAbbreviation: In(quarters), }, }),
        );
      }
      else{
        data = await this.map.many(
          await this.entityManager.find(entity, { where: { orisCode: In(orisCodes), }}),
      );
      }

      if (data.length > 0 && isWorkspace) {
        const monPlanIds = data.map(d => d?.monPlanId);
        const periodAbbreviation =  [...new Set(data.map(d => d?.periodAbbreviation))];
        const parameters = [monPlanIds]
         let query =`select em.mon_plan_id, sc.severity_cd_description, sc.severity_cd
        from camdecmpswks.EMISSION_EVALUATION em
        JOIN camdecmpsmd.reporting_period prd ON prd.rpt_period_id = em.rpt_period_id  
        JOIN camdecmpswks.monitor_plan pln ON pln.mon_plan_id = em.mon_plan_id  
        JOIN camdecmpswks.check_session cs on cs.chk_session_id = em.chk_session_id 
        JOIN camdecmpsmd.severity_code sc on sc.severity_cd = cs.severity_cd`;
        
        if(hasQuarters && monPlanIds){
          query += ' where em.mon_plan_id = ANY($1) AND prd.period_abbreviation = ANY($2);'
          parameters.push(periodAbbreviation)
        }
        else
        {
          query += ' where em.mon_plan_id = ANY($1);'
        }
        let severities = await this.entityManager.query(query,parameters)
        const severityMap:Map<string, {description:string,severityCode:string}> = new Map(
          severities.map((s: any) => [s.mon_plan_id, { description: s.severity_cd_description, severityCode: s.severity_cd }])
        );

        for (const d of data) {
          let {description, severityCode} = severityMap.get(d.monPlanId) ?? {};
          d.severityDescription = description
          d.severityCode = severityCode
        }
      }
      return data;
    } catch (e) {
      throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
