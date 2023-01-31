import { Injectable } from '@nestjs/common';
import { DerivedHourlyValueRepository } from './derived-hourly-value.repository';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { DerivedHourlyValueParamsDto } from '../dto/derived-hourly-value-params.dto';
import { DerivedHourlyValueDTO } from '../dto/derived-hourly-value.dto';
import { exportSupplementaryDerivedHourlyValues } from '../derived-hourly-value-functions/derived-hourly-value-export';

@Injectable()
export class DerivedHourlyValueService {
  constructor(
    private readonly repository: DerivedHourlyValueRepository,
    private readonly map: DerivedHourlyValueMap,
  ) {}

  async export(hourIds: string[]) {
    const derivedHourlyValueData = await this.repository.export(hourIds);

    const promises = derivedHourlyValueData?.map(data => {
      return this.map.one(data);
    });

    return Promise.all(promises);
  }

  async supplementaryExport(
    params: DerivedHourlyValueParamsDto,
  ): Promise<DerivedHourlyValueDTO[]> {
    return exportSupplementaryDerivedHourlyValues(params, this.repository);
  }
}
