import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { DerivedHourlyValueRepository } from '../derived-hourly-value/derived-hourly-value.repository';
import {
  genDerivedHourlyValueParamsDto,
  genDerivedHrlyValues,
} from '../../test/object-generators/derived-hourly-value';
import { DerivedHrlyValue } from '../entities/derived-hrly-value.entity';
import { exportSupplementaryDerivedHourlyValues } from './derived-hourly-value-export';

describe('DerivedHourlyValueExport', () => {
  let map: DerivedHourlyValueMap;
  let repository: DerivedHourlyValueRepository;
  let derivedHourlyExportModule: typeof import('./derived-hourly-value-export');

  beforeAll(async () => {
    map = new DerivedHourlyValueMap();
    repository = new DerivedHourlyValueRepository();
    derivedHourlyExportModule = await import('./derived-hourly-value-export');
  });

  it('should export derived hourly values given correct endpoint parameters', async function() {
    const mockderivedHourlyValues = genDerivedHrlyValues<DerivedHrlyValue>();
    jest
      .spyOn(
        derivedHourlyExportModule,
        'exportSupplementaryDerivedHourlyValuesQuery',
      )
      .mockResolvedValue(mockderivedHourlyValues);
    const mappedValues = await map.many(mockderivedHourlyValues);

    await expect(
      exportSupplementaryDerivedHourlyValues(
        genDerivedHourlyValueParamsDto()[0],
        repository,
      ),
    ).resolves.toEqual(mappedValues);
  });
});
