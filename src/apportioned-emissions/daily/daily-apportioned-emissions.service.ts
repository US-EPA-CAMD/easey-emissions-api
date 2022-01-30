import { v4 as uuid } from 'uuid';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { 
  Injectable,
  StreamableFile,
  InternalServerErrorException
} from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import {
  PlainToCSV,
  PlainToJSON
} from '@us-epa-camd/easey-common/transforms';

import { fieldMappings } from '../../constants/field-mappings';
import { DayUnitData } from '../../entities/day-unit-data.entity';
import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsDTO } from '../../dto/daily-apportioned-emissions.dto';
import { DailyApportionedEmissionsMap } from '../../maps/daily-apportioned-emissions.map';
import { 
  DailyApportionedEmissionsParamsDTO,
  PaginatedDailyApportionedEmissionsParamsDTO,
} from '../../dto/daily-apportioned-emissions.params.dto';

@Injectable()
export class DailyApportionedEmissionsService {
  constructor(
    @InjectRepository(DayUnitDataRepository)
    private readonly repository: DayUnitDataRepository,
    private readonly map: DailyApportionedEmissionsMap,
    private readonly logger: Logger,
  ) { }

  async getEmissions(
    req: Request,
    params: PaginatedDailyApportionedEmissionsParamsDTO,
  ): Promise<DailyApportionedEmissionsDTO[]> {
    let entities: DayUnitData[];

    try {
      entities = await this.repository.getEmissions(req, params);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.daily),
    );

    return this.map.many(entities);
  }  

  async streamEmissions(
    req: Request,
    params: DailyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const stream = await this.repository.streamEmissions(params);

    if (req.headers.accept === "text/csv") {
      const toCSV = new PlainToCSV(fieldMappings.emissions.daily);
      return new StreamableFile(stream.pipe(toCSV), {
        disposition: `attachment; filename="daily-emissions-${uuid()}.csv"`,
      });
    }

    const objToString = new PlainToJSON();
    return new StreamableFile(stream.pipe(objToString), {
      disposition: `attachment; filename="daily-emissions-${uuid()}.json"`,
    });
  }
}
