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
import { MonthUnitData } from '../../entities/month-unit-data.entity';
import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthlyApportionedEmissionsDTO } from '../../dto/monthly-apportioned-emissions.dto';
import { MonthlyApportionedEmissionsMap } from '../../maps/monthly-apportioned-emissions.map';
import { 
  MonthlyApportionedEmissionsParamsDTO,
  PaginatedMonthlyApportionedEmissionsParamsDTO,
} from '../../dto/monthly-apportioned-emissions.params.dto';

@Injectable()
export class MonthlyApportionedEmissionsService {
  constructor(
    @InjectRepository(MonthUnitDataRepository)
    private readonly repository: MonthUnitDataRepository,
    private readonly map: MonthlyApportionedEmissionsMap,
    private readonly logger: Logger,
  ) { }

  async getEmissions(
    req: Request,
    params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<MonthlyApportionedEmissionsDTO[]> {
    let entities: MonthUnitData[];

    try {
      entities = await this.repository.getEmissions(req, params);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.monthly),
    );

    return this.map.many(entities);
  }  

  async streamEmissions(
    req: Request,
    params: MonthlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const stream = await this.repository.streamEmissions(params);

    if (req.headers.accept === "text/csv") {
      const toCSV = new PlainToCSV(fieldMappings.emissions.monthly);
      return new StreamableFile(stream.pipe(toCSV), {
        disposition: `attachment; filename="monthly-emissions-${uuid()}.csv"`,
      });
    }

    const objToString = new PlainToJSON();
    return new StreamableFile(stream.pipe(objToString), {
      disposition: `attachment; filename="monthly-emissions-${uuid()}.json"`,
    });
  }
}
