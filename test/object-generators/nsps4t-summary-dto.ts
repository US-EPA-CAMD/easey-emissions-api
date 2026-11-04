import { Nsps4tCompliancePeriodImportDTO } from '../../src/dto/nsps4t-compliance-period.dto';
import { Nsps4tAnnualImportDTO } from '../../src/dto/nsps4t-annual.dto';
import { faker } from '@faker-js/faker';
import { optionalValue } from './util';
import { genNsps4tCompliancePeriodImportDTO } from './nsps4t-compliance-period-dto';
import { genNsps4tAnnualImportDto } from './nsps4t-annual-dto';

type GenNsps4tSummaryImportDtoConfig = {
  include?: Array<'nsps4tCompliancePeriodData' | 'nsps4tFourthQuarterData'>;
  nsps4tCompliancePeriodDataAmount?: number;
  nsps4tFourthQuarterDataAmount?: number;
};

export const genNsps4tSummaryImportDto = (
  amount = 1,
  config?: GenNsps4tSummaryImportDtoConfig,
) => {
  const dtos = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      stackPipeId: optionalValue(faker.string.sample()),
      unitId: optionalValue(faker.string.sample()),
      co2EmissionStandardCode: optionalValue(faker.string.sample()),
      modusValue: optionalValue(faker.number.int()),
      modusUnitsOfMeasureCode: optionalValue(faker.string.sample()),
      electricalLoadCode: optionalValue(faker.string.sample()),
      noCompliancePeriodEndedIndicator: optionalValue(faker.number.int()),
      noCompliancePeriodEndedComment: optionalValue(faker.string.sample()),
      nsps4tCompliancePeriodData: config?.include.includes(
        'nsps4tCompliancePeriodData',
      )
        ? genNsps4tCompliancePeriodImportDTO(
            config?.nsps4tCompliancePeriodDataAmount,
          )
        : undefined,
      nsps4tFourthQuarterData: config?.include.includes(
        'nsps4tFourthQuarterData',
      )
        ? genNsps4tAnnualImportDto(config?.nsps4tFourthQuarterDataAmount)
        : undefined,
    });
  }

  return dtos;
};
