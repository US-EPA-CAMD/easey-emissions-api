import { HourlyOperatingParamsDto } from '../dto/hourly-operating.params.dto';
import { HourlyOperatingRepository } from '../hourly-operating/hourly-operating.repository';
import { HourlyOperatingDTO } from '../dto/hourly-operating.dto';
import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { HrlyOpData } from '../entities/hrly-op-data.entity';
import { quarterFromMonth } from '../utils/util-modules/date-utils';

export const exportSupplementaryHourlyOperatingDataQuery = async (
  params: HourlyOperatingParamsDto,
  repository: HourlyOperatingRepository,
): Promise<HrlyOpData[]> => {
  const beginYear = params.beginDate.getFullYear();
  const beginQuarter = quarterFromMonth(params.beginDate.getMonth());
  const endYear = params.endDate.getFullYear();
  const endQuarter = quarterFromMonth(params.endDate.getMonth());

  const plantConditions = `
    plant.oris_code IN (${params.orisCode.join(', ')}) 
    AND plant.oris_code NOTNULL
  `;
  const reportingPeriodConditions = `
    reportingPeriod.calendar_year >= ${beginYear} AND
    reportingPeriod.quarter >= ${beginQuarter} AND
    reportingPeriod.calendar_year <= ${endYear} AND
    reportingPeriod.quarter <= ${endQuarter}
  `;

  const query = repository
    .createQueryBuilder('hourlyOp')
    .innerJoinAndSelect('hourlyOp.monitorLocation', 'monitorLocation')
    .innerJoin('monitorLocation.monitorPlans', 'monitorPlans')
    .innerJoin('monitorPlans.plant', 'plant', plantConditions)
    .innerJoin(
      'hourlyOp.reportingPeriod',
      'reportingPeriod',
      reportingPeriodConditions,
    );

  return query.getMany();
};

export const exportSupplementaryHourlyOperatingData = async (
  params: HourlyOperatingParamsDto,
  repository: HourlyOperatingRepository,
): Promise<HourlyOperatingDTO[]> => {
  const data = await exportSupplementaryHourlyOperatingDataQuery(
    params,
    repository,
  );

  return new HourlyOperatingMap().many(data);
};
