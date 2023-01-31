import { faker } from '@faker-js/faker';
import { SummaryValueImportDTO } from '../../src/dto/summary-value.dto';
import { SummaryValueParamsDto } from '../../src/dto/summary-value-params.dto';

export const genSummaryValueImportDto = (amount = 1) => {
  const summaryValues: SummaryValueImportDTO[] = [];

  let unitId = null;
  let stackPipeId = null;
  if (faker.datatype.boolean()) unitId = faker.datatype.string();
  else stackPipeId = faker.datatype.string();

  for (let i = 0; i < amount; i++) {
    summaryValues.push({
      stackPipeId,
      unitId,
      parameterCode: faker.datatype.string(),
      currentReportingPeriodTotal: faker.datatype.number(),
      ozoneSeasonToDateTotal: faker.datatype.number(),
      yearToDateTotal: faker.datatype.number(),
    });
  }

  return summaryValues;
};

export const genSummaryValueParamsDtos = (
  amount = 1,
): SummaryValueParamsDto[] => {
  const dtos: SummaryValueParamsDto[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      beginQuarter: faker.helpers.arrayElement([1, 2, 3, 4]),
      beginYear: faker.date.soon().getFullYear(),
      endQuarter: faker.helpers.arrayElement([1, 2, 3, 4]),
      endYear: faker.date.soon().getFullYear(),
      orisCode: (Array.from({ length: 3 }, () =>
        faker.datatype.string(6),
      ) as unknown) as number[],
    });
  }

  return dtos;
};
