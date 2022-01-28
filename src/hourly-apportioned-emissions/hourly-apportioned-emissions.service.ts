import { v4 as uuid } from 'uuid';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { 
  Injectable,
  StreamableFile,
  InternalServerErrorException
} from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { fieldMappings } from '../constants/field-mappings';
import { HourUnitData } from 'src/entities/hour-unit-data.entity';
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { ConvertPlainToCSV, ConvertPlainToString } from '../transforms/transforms';
import { HourlyApportionedEmissionsDTO } from '../dto/hourly-apportioned-emissions.dto';
import { HourlyApportionedEmissionsMap } from '../maps/hourly-apportioned-emissions.map';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';

@Injectable()
export class HourlyApportionedEmissionsService {
  constructor(
    @InjectRepository(HourUnitDataRepository)
    private readonly hourlyRepository: HourUnitDataRepository,
    private readonly hourlyMap: HourlyApportionedEmissionsMap,
    private readonly logger: Logger,
  ) { }

  async getEmissions(
    req: Request,
    params: HourlyApportionedEmissionsParamsDTO,
  ): Promise<HourlyApportionedEmissionsDTO[]> {
    let entities: HourUnitData[];

    try {
      entities = await this.hourlyRepository.getEmissions(req, params);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.hourly),
    );

    return this.hourlyMap.many(entities);
  }  

  async streamEmissions(
    req: Request,
    params: HourlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const stream = await this.hourlyRepository.streamEmissions(params);

    if (req.headers.accept === "text/csv") {
      const toCSV = new ConvertPlainToCSV(fieldMappings.emissions.hourly);
      return new StreamableFile(stream.pipe(toCSV), {
        disposition: `attachment; filename="hourly-emissions-${uuid()}.csv"`,
      });
    }

    const objToString = new ConvertPlainToString();
    return new StreamableFile(stream.pipe(objToString), {
      disposition: `attachment; filename="hourly-emissions-${uuid()}.json"`,
    });
  }
}
