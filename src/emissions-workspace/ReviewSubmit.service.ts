import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions/easey.exception';
import { In } from 'typeorm';

import { EmissionsReviewSubmitDTO } from '../dto/emissions-review-submit.dto';
import { EmissionsReviewSubmitMap } from '../maps/emissions-review-submit.map';
import { EmissionsReviewSubmitAllRepository } from './emissions-review-submit-all.repository';
import { EmissionsReviewSubmitAllGlobalRepository } from './emissions-review-submit-all-global.repository';
import { EmissionsReviewSubmitEarliestRepository } from './emissions-review-submit-earliest.repository';
import { EntityManager } from 'typeorm';

@Injectable()
export class ReviewSubmitService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly allWorkspaceRepository: EmissionsReviewSubmitAllRepository,
    private readonly allGlobalRepository: EmissionsReviewSubmitAllGlobalRepository,
    private readonly earliestWorkspaceRepository: EmissionsReviewSubmitEarliestRepository,
    private readonly map: EmissionsReviewSubmitMap,
  ) {}

  async getEmissionsRecords({
    orisCodes,
    monPlanIds,
    quarters,
    isWorkspace = false,
    earliestOnly = false, // Flag to indicate if only the earliest record per monitor plan is needed
  }: {
    orisCodes: number[],
    monPlanIds: string[],
    quarters: string[],
    isWorkspace?: boolean,
    earliestOnly?: boolean,
  }): Promise<EmissionsReviewSubmitDTO[]> {

    let repository;
    if (isWorkspace) {
      if (earliestOnly) repository = this.earliestWorkspaceRepository;
      else repository = this.allWorkspaceRepository;
    } else {
      if (earliestOnly) {
        throw new EaseyException(
          new Error('"earliest" flag only applicable for workspace.'),
          HttpStatus.BAD_REQUEST,
        );
      }
      else repository = this.allGlobalRepository;
    }

    let data: EmissionsReviewSubmitDTO[];

    const hasMonPlanIds = monPlanIds && monPlanIds.length > 0;
    const hasQuarters = quarters && quarters.length > 0;

    try {
      if (hasMonPlanIds && hasQuarters) {
        data = await this.map.many(
          await repository.find({ where: { monPlanId: In(monPlanIds), periodAbbreviation: In(quarters), }, }),
        );
      } else if (hasMonPlanIds) {
         data = await this.map.many(
          await repository.find({ where: { monPlanId: In(monPlanIds), }, }),
        );
      } else if (hasQuarters) {
         data = await this.map.many(
          await repository.find({ where: { orisCode: In(orisCodes), periodAbbreviation: In(quarters), }, }),
        );
      }
      else{
        data = await this.map.many(
          await repository.find({ where: { orisCode: In(orisCodes), }}),
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
