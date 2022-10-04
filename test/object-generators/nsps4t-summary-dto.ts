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
      stackPipeId: optionalValue(faker.datatype.string()),
      unitId: optionalValue(faker.datatype.string()),
      co2EmissionStandardCode: optionalValue(faker.datatype.string()),
      modusValue: optionalValue(faker.datatype.number()),
      modusUomCode: optionalValue(faker.datatype.string()),
      electricalLoadCode: optionalValue(faker.datatype.string()),
      noCompliancePeriodEndedIndicator: optionalValue(faker.datatype.number()),
      noCompliancePeriodEndedComment: optionalValue(faker.datatype.string()),
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
