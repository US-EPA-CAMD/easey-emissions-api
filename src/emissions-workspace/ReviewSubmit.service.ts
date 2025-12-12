import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions/easey.exception';
import { DataSource, EntityManager, In, LessThanOrEqual } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

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
    private readonly dataSource: DataSource,
    private readonly entityManager: EntityManager,
    private readonly map: EmissionsReviewMap,
  ) { }

  async getEmissionsRecords({
    orisCodes,
    monPlanIds,
    quarters,
    isWorkspace = false,
    mode = EmissionsRetrievalMode.REPORT, // Indicates the type of data to retrieve
  }: {
    orisCodes: number[];
    monPlanIds: string[];
    quarters: string[];
    isWorkspace?: boolean;
    mode?: EmissionsRetrievalMode;
  }): Promise<EmissionsReviewDTO[]> {
    const entity = (() => {
      switch (mode) {
        case EmissionsRetrievalMode.REPORT:
          return isWorkspace
            ? EmissionsReviewReport
            : EmissionsReviewReportGlobal;
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

    const conditions = {};

    if (hasMonPlanIds) {
      conditions['monPlanId'] = In(monPlanIds);
    } else {
      conditions['orisCode'] = In(orisCodes);
    }

    if (hasQuarters) {
      if (mode === EmissionsRetrievalMode.SUBMIT) {
        // For 'submit' mode, retrieve all records up to and including the latest quarter specified.
        // Period abbreviations are of the format 'YYYY-Q#', so we can safely sort them lexicographically.
        const maxQuarter = quarters.reduce((a, b) => (a > b ? a : b), quarters[0]);
        conditions['periodAbbreviation'] = LessThanOrEqual(maxQuarter);
      } else {
        conditions['periodAbbreviation'] = In(quarters);
      }
    }

    try {
      if (isWorkspace) {
         data = await this.map.many(
          await this.entityManager.find(entity, { where: conditions }),
        );
      } else {
       data = await withSlaveConnection(this.dataSource, async (entityManager: EntityManager) => {
          const results = await entityManager.find(entity, { where: conditions });
          return this.map.many(results);
        });
      }

      return data;
    } catch (e) {
      throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
