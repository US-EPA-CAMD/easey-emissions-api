import { SorbentTrapRepository } from '../sorbent-trap/sorbent-trap.repository';
import { genSorbentTrap } from '../../test/object-generators/sorbent-trap';
import { SorbentTrapMap } from '../maps/sorbent-trap.map';
import { SorbentTrap } from '../entities/sorbent-trap.entity';
import { faker } from '@faker-js/faker';

describe('ExportSorbentTrapData', () => {
  let exportSorbentTrapModule: typeof import('./export-sorbent-trap-data');
  let sorbentTrapRepository;

  beforeAll(async () => {
    sorbentTrapRepository = new SorbentTrapRepository();
    exportSorbentTrapModule = await import('./export-sorbent-trap-data');
  });

  it('should export records', async function() {
    const sorbentTrapMocks = genSorbentTrap<SorbentTrap>(3);
    const mappedSorbentTrap = await new SorbentTrapMap().many(sorbentTrapMocks);

    jest
      .spyOn(exportSorbentTrapModule, 'exportSorbentTrapQuery')
      .mockResolvedValue(sorbentTrapMocks);

    await expect(
      exportSorbentTrapModule.exportSorbentTrapData({
        monitoringLocationIds: faker.helpers.uniqueArray(
          faker.datatype.string,
          2,
        ),
        year: faker.date.soon().getFullYear(),
        quarter: faker.helpers.arrayElement([1, 2, 3, 4]),
        repository: sorbentTrapRepository,
      }),
    ).resolves.toEqual(mappedSorbentTrap);
  });
});
