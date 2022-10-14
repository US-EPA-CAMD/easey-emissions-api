import { SummaryValue } from '../entities/summary-value.entity';
import { SummaryValueRepository } from '../summary-value/summary-value.repository';
import { SummaryValueMap } from '../maps/summary-value.map';
import { SummaryValueDTO } from '../dto/summary-value.dto';
import { SummaryValueParamsDto } from '../dto/summary-value-params.dto';

export const exportSupplementarySummaryValuesQuery = async (
  params: SummaryValueParamsDto,
  repository: SummaryValueRepository,
): Promise<SummaryValue[]> => {
  return repository.find({
    where: {
      monitorLocation: {
        stackPipe: {
          plant: {
            orisCode: params.orisCodes,
          },
        },
      },
      reportingPeriod: {
        quarter: {
          greaterThanOrEqual: params.beginQuarter,
          lessThanOrEqual: params.endQuarter,
        },
        year: {
          greaterThanOrEqual: params.beginYear,
          lessThanOrEqual: params.endYear,
        },
      },
    },
  });
};

export const exportSupplementarySummaryValues = async (
  params: SummaryValueParamsDto,
  repository: SummaryValueRepository,
): Promise<SummaryValueDTO[]> => {
  const data = await exportSupplementarySummaryValuesQuery(params, repository);

  return new SummaryValueMap().many(data);
};
