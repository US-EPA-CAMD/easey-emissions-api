import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import {getManager} from "typeorm";
import { EmissionSubmissionsProgress } from '../entities/emissions-submission-progress.entity';
import { EmissionSubmissionsProgressMap } from '../maps/emissions-submission-progress.map';
import { EmissionsSubmissionsProgressDTO } from '../dto/emissions-submission-progress.dto';

@Injectable()
export class EmissionService {
  constructor(private map: EmissionSubmissionsProgressMap, private logger: Logger){}

  async executeSubmissionProgressQuery(periodDate: string){
    const entityManager = getManager();    
    let submissionPeriod;  

    try{
        submissionPeriod = await entityManager.createQueryBuilder(EmissionSubmissionsProgress, "submissions")
        .where(":date >= submissions.end_date + interval '1' day", { date: periodDate })
        .andWhere(":date <= submissions.end_date + interval '38' day", { date: periodDate })
        .getOne();
    }
    catch(error){
      this.logger.error(InternalServerErrorException, error, true, {date: periodDate})
    }
    return submissionPeriod;
  }

  async getSubmissionProgress(periodDate: string): Promise<EmissionsSubmissionsProgressDTO> {
      const submissionPeriod = await this.executeSubmissionProgressQuery(periodDate);
      
      if(submissionPeriod === undefined){
        return undefined;
      }

      const mappedDTO = this.map.one(submissionPeriod);
 
      return mappedDTO;
  } 
}
  