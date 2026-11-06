import { faker } from '@faker-js/faker';

import { WeeklySystemIntegrityImportDTO } from '../../src/dto/weekly-system-integrity.dto';

export const genWeeklySystemIntegrityDto = (amount = 1) => {
  const weeklySystemIntegrity: WeeklySystemIntegrityImportDTO[] = [];

  for (let i = 0; i < amount; i++) {
    weeklySystemIntegrity.push({
      gasLevelCode: faker.string.sample(),
      referenceValue: faker.number.int(),
      measuredValue: faker.number.int(),
      apsIndicator: faker.number.int(),
      systemIntegrityError: faker.number.int(),
    });
  }

  return weeklySystemIntegrity;
};
