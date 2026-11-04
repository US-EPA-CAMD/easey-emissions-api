import { faker } from '@faker-js/faker';
import { SummaryValueImportDTO } from '../../src/dto/summary-value.dto';

export const genSummaryValueImportDto = (amount = 1) => {
  const summaryValues: SummaryValueImportDTO[] = [];

  let unitId = null;
  let stackPipeId = null;
  if (faker.datatype.boolean()) unitId = faker.string.sample();
  else stackPipeId = faker.string.sample();

  for (let i = 0; i < amount; i++) {
    summaryValues.push({
      stackPipeId,
      unitId,
      parameterCode: faker.string.sample(),
      currentReportingPeriodTotal: faker.number.int(),
      ozoneSeasonToDateTotal: faker.number.int(),
      yearToDateTotal: faker.number.int(),
    });
  }

  return summaryValues;
};
