import { faker } from '@faker-js/faker';

import { WeeklySystemIntegrityImportDTO } from '../../src/dto/weekly-system-integrity.dto';

export const genWeeklySystemIntegrityDto = (amount = 1) => {
  const weeklySystemIntegrity: WeeklySystemIntegrityImportDTO[] = [];

  for (let i = 0; i < amount; i++) {
    weeklySystemIntegrity.push({
      gasLevelCode: faker.datatype.string(),
      referenceValue: faker.datatype.number(),
      measuredValue: faker.datatype.number(),
      apsIndicator: faker.datatype.number(),
      systemIntegrityError: faker.datatype.number(),
    });
  }

  return weeklySystemIntegrity;
};
