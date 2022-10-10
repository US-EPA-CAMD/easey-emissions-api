import { faker } from '@faker-js/faker';

import { WeeklyTestSummaryImportDTO } from '../../src/dto/weekly-test-summary.dto';
import { genWeeklySystemIntegrityDto } from './weekly-system-integrity.dto';

type WeeklyTestSummaryImportDtoConfig = {
  include?: Array<'weeklySystemIntegrity'>;
  weeklySystemIntegrityAmount?: number;
};

export const genWeeklyTestSummaryDto = (
  amount = 1,
  config?: WeeklyTestSummaryImportDtoConfig,
) => {
  const weeklyTestSummary: WeeklyTestSummaryImportDTO[] = [];

  let unitId = null;
  let stackPipeId = null;
  if (faker.datatype.boolean()) unitId = faker.datatype.string();
  else stackPipeId = faker.datatype.string();

  for (let i = 0; i < amount; i++) {
    weeklyTestSummary.push({
      stackPipeId,
      unitId,
      date: faker.datatype.datetime(),
      hour: faker.datatype.number(),
      minute: faker.datatype.number(),
      componentId: faker.datatype.string(),
      testTypeCode: faker.datatype.string(),
      testResultCode: faker.datatype.string(),
      spanScaleCode: faker.datatype.string(),
      weeklySystemIntegrityData: config?.include.includes(
        'weeklySystemIntegrity',
      )
        ? genWeeklySystemIntegrityDto(config?.weeklySystemIntegrityAmount)
        : undefined,
    });
  }

  return weeklyTestSummary;
};
