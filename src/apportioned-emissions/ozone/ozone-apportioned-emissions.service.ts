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
import { OzoneUnitData } from '../../entities/ozone-unit-data.entity';
import { OzoneUnitDataRepository } from './ozone-unit-data.repository';
import { OzoneApportionedEmissionsDTO } from '../../dto/ozone-apportioned-emissions.dto';
import { OzoneApportionedEmissionsMap } from '../../maps/ozone-apportioned-emissions.map';
import { 
  OzoneApportionedEmissionsParamsDTO,
  PaginatedOzoneApportionedEmissionsParamsDTO
} from '../../dto/ozone-apportioned-emissions.params.dto';

@Injectable()
export class OzoneApportionedEmissionsService {
  constructor(
    @InjectRepository(OzoneUnitDataRepository)
    private readonly repository: OzoneUnitDataRepository,
    private readonly map: OzoneApportionedEmissionsMap,
    private readonly logger: Logger,
  ) { }

  async getEmissions(
    req: Request,
    params: PaginatedOzoneApportionedEmissionsParamsDTO,
  ): Promise<OzoneApportionedEmissionsDTO[]> {
    let entities: OzoneUnitData[];

    try {
      entities = await this.repository.getEmissions(req, params);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.ozone),
    );

    return this.map.many(entities);
  }  

  async streamEmissions(
    req: Request,
    params: OzoneApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const stream = await this.repository.streamEmissions(params);

    if (req.headers.accept === "text/csv") {
      const toCSV = new PlainToCSV(fieldMappings.emissions.ozone);
      return new StreamableFile(stream.pipe(toCSV), {
        disposition: `attachment; filename="ozone-emissions-${uuid()}.csv"`,
      });
    }

    const objToString = new PlainToJSON();
    return new StreamableFile(stream.pipe(objToString), {
      disposition: `attachment; filename="ozone-emissions-${uuid()}.json"`,
    });
  }
}
