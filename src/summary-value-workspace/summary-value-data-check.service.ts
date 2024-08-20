import { Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { EmissionsImportDTO } from '../dto/emissions.dto';

@Injectable()
export class SummaryValueDataCheckService {
  constructor(private readonly logger: Logger) {
    this.logger.setContext('SummaryValueDataCheckService');
  }

  runChecks(payload: EmissionsImportDTO): string[] {
    this.logger.log('Running Summary Value Data Checks');

    const errorList: string[] = [];
    const seen = new Set<string>();
    const duplicates = new Set<any>();

    payload?.summaryValueData?.forEach(dts => {
      const key = `${dts.unitId}|${dts.stackPipeId}|${dts.parameterCode}`;
      
      if (seen.has(key)) {
        duplicates.add(dts);
      } else {
        seen.add(key);
      }
    });

    this.logger.log('Completed Summary Value Data Checks');

    if (duplicates.size > 0) {
        const firstDuplicate = Array.from(duplicates)[0];
        const message = `Import contains duplicate SummaryValue data for Location '${firstDuplicate.unitId || firstDuplicate.stackPipeId}', Quarter ${payload.year} Q${payload.quarter}, and Parameter Code '${firstDuplicate.parameterCode}'.`;
        errorList.push(message);
    }
    return errorList.filter(e => e !== null);
  }
}
