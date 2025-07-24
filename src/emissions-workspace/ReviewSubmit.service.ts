import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions/easey.exception';
import { In } from 'typeorm';

import { EmissionsReviewSubmitDTO } from '../dto/emissions-review-submit.dto';
import { EmissionsReviewSubmitMap } from '../maps/emissions-review-submit.map';
import { EmissionsReviewSubmitRepository } from './ReviewSubmit.repository';
import { EmissionsReviewSubmitGlobalRepository } from './ReviewSubmitGlobal.repository';
import { EntityManager } from 'typeorm';

@Injectable()
export class ReviewSubmitService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly workspaceRepository: EmissionsReviewSubmitRepository,
    private readonly globalRepository: EmissionsReviewSubmitGlobalRepository,
    private readonly map: EmissionsReviewSubmitMap,
  ) {}

  async getEmissionsRecords(
    orisCodes: number[],
    monPlanIds: string[],
    quarters: string[],
    isWorkspace: boolean = true,
  ): Promise<EmissionsReviewSubmitDTO[]> {

    let repository;
    if (isWorkspace) {
      repository = this.workspaceRepository;
    } else {
      repository = this.globalRepository;
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

      if (data.length > 0) {
        const monPlanIds = data.map(d => d.monPlanId);
        const severities = await this.entityManager.query(
        `select em.mon_plan_id, sc.severity_cd_description, sc.severity_cd
        from camdecmpswks.EMISSION_EVALUATION em 
        JOIN camdecmpsmd.reporting_period prd ON prd.rpt_period_id = em.rpt_period_id  
        JOIN camdecmpswks.monitor_plan pln ON pln.mon_plan_id = em.mon_plan_id  
        JOIN camdecmpswks.check_session cs on cs.chk_session_id = em.chk_session_id 
        JOIN camdecmpsmd.severity_code sc on sc.severity_cd = cs.severity_cd 
        where em.mon_plan_id = ANY($1);`,
        [monPlanIds]);
        
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
