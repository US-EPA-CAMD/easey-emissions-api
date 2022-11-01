import { HourlyOperatingParamsDto } from '../dto/hourly-operating.params.dto';
import { HourlyOperatingRepository } from '../hourly-operating/hourly-operating.repository';
import { HourlyOperatingDTO } from '../dto/hourly-operating.dto';
import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { HrlyOpData } from '../entities/hrly-op-data.entity';
import { quarterFromMonth } from '../utils/util-modules/date-utils';
import { hasArrayValues } from '../utils/utils';

export const exportSupplementaryHourlyOperatingDataQuery = async (
  params: HourlyOperatingParamsDto,
  repository: HourlyOperatingRepository,
): Promise<HrlyOpData[]> => {
  const beginYear = new Date(params.beginDate).getFullYear();
  const beginQuarter = quarterFromMonth(new Date(params.beginDate).getMonth());
  const endYear = new Date(params.endDate).getFullYear();
  const endQuarter = quarterFromMonth(new Date(params.endDate).getMonth());

  const reportingPeriodConditions = `reportingPeriod.calendar_year BETWEEN ${beginYear} AND ${endYear} AND reportingPeriod.quarter BETWEEN ${beginQuarter} AND ${endQuarter}`;

  let query = repository
    .createQueryBuilder('hourlyOp')
    .innerJoinAndSelect('hourlyOp.monitorLocation', 'monitorLocation')
    .innerJoin(
      'hourlyOp.reportingPeriod',
      'reportingPeriod',
      reportingPeriodConditions,
    );

  if (hasArrayValues(params.orisCode)) {
    const plantConditions = `plant.oris_code IN (${params.orisCode.join(
      ', ',
    )}) AND plant.oris_code NOTNULL`;

    query = query
      .innerJoin('monitorLocation.monitorPlans', 'monitorPlans')
      .innerJoin('monitorPlans.plant', 'plant', plantConditions);
  }

  if (hasArrayValues(params.locationName)) {
    const locationStrings = params.locationName
      ?.map(location => `'${location}'`)
      .join(', ');

    const stackPipeCondition = `stackPipe.stack_name IN (${locationStrings})`;
    const unitCondition = `unit.unitid IN (${locationStrings})`;

    query = query
      .leftJoinAndSelect(
        'monitorLocation.stackPipe',
        'stackPipe',
        stackPipeCondition,
      )
      .leftJoinAndSelect('monitorLocation.unit', 'unit', unitCondition);
  }

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
