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
  if (faker.datatype.boolean()) unitId = faker.string.sample();
  else stackPipeId = faker.string.sample();

  for (let i = 0; i < amount; i++) {
    weeklyTestSummary.push({
      stackPipeId,
      unitId,
      date: faker.date.anytime(),
      hour: faker.number.int(),
      minute: faker.number.int(),
      componentId: faker.string.sample(),
      testTypeCode: faker.string.sample(),
      testResultCode: faker.string.sample(),
      spanScaleCode: faker.string.sample(),
      weeklySystemIntegrityData: config?.include.includes(
        'weeklySystemIntegrity',
      )
        ? genWeeklySystemIntegrityDto(config?.weeklySystemIntegrityAmount)
        : undefined,
    });
  }

  return weeklyTestSummary;
};
