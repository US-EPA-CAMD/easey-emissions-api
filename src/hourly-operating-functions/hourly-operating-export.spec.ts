import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { HourlyOperatingRepository } from '../hourly-operating/hourly-operating.repository';
import { genHourlyOpValues } from '../../test/object-generators/hourly-op-data-values';
import { HrlyOpData } from '../entities/hrly-op-data.entity';
import { genHourlyOperatingParamsDto } from '../../test/object-generators/hourly-operating-dto';
import { exportSupplementaryHourlyOperatingData } from './hourly-operating-export';

describe('HourlyOperatingExport', () => {
  let map: HourlyOperatingMap;
  let repository: HourlyOperatingRepository;
  let hourlyOperatingExportModule: typeof import('./hourly-operating-export');

  beforeAll(async () => {
    map = new HourlyOperatingMap();
    repository = new HourlyOperatingRepository();
    hourlyOperatingExportModule = await import('./hourly-operating-export');
  });

  it('should export hourly operating data given correct endpoint parameters', async function() {
    const mockHourlyOperatingData = genHourlyOpValues<HrlyOpData>();
    jest
      .spyOn(
        hourlyOperatingExportModule,
        'exportSupplementaryHourlyOperatingDataQuery',
      )
      .mockResolvedValue(mockHourlyOperatingData);
    const mappedValues = await map.many(mockHourlyOperatingData);

    await expect(
      exportSupplementaryHourlyOperatingData(
        genHourlyOperatingParamsDto()[0],
        repository,
      ),
    ).resolves.toEqual(mappedValues);
  });
});
