import { DailyEmissionRepository } from '../daily-emission/daily-emission.repository';
import { genDailyEmission } from '../../test/object-generators/daily-emission';
import { DailyEmission } from '../entities/daily-emission.entity';
import { DailyEmissionMap } from '../maps/daily-emission.map';
import { exportDailyEmissionData } from './export-daily-emission-data';
import { faker } from '@faker-js/faker';

describe('ExportDailyEmissionData', () => {
  let dailyEmissionRepository;

  beforeAll(async () => {
    dailyEmissionRepository = new DailyEmissionRepository();
  });

  it('should export records', async function() {
    const dailyEmissionMocks = genDailyEmission<DailyEmission>(3);
    const mappedDailyEmision = await new DailyEmissionMap().many(
      dailyEmissionMocks,
    );

    const createQueryBuilder: any = {
      distinct: () => {
        return {
          leftJoinAndSelect: () => {
            return {
              leftJoin: () => {
                return {
                  where: () => {
                    return {
                      andWhere: () => {
                        return {
                          andWhere: () => {
                            return {
                              getMany: () => dailyEmissionMocks,
                            };
                          },
                        };
                      },
                    };
                  },
                };
              },
            };
          },
        };
      },
    };
    jest
      .spyOn(dailyEmissionRepository, 'createQueryBuilder')
      .mockImplementationOnce(() => createQueryBuilder);

    await expect(
      exportDailyEmissionData({
        quarter: faker.helpers.arrayElement([1, 2, 3, 4]),
        year: faker.date.soon().getFullYear(),
        repository: dailyEmissionRepository,
        monitoringLocationIds: faker.helpers.uniqueArray(
          faker.datatype.string,
          3,
        ),
      }),
    ).resolves.toEqual(mappedDailyEmision);
  });
});
