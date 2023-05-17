import { faker } from '@faker-js/faker';
import { AnnualApportionedEmissionsAggregationDTO } from '../../src/dto/annual-apportioned-emissions-aggregation.dto';
import { AnnualApportionedEmissionsStateAggregationDTO } from '../../src/dto/annual-apportioned-emissions-state-aggregation.dto';
import { DailyApportionedEmissionsFacilityAggregationDTO } from '../../src/dto/daily-apportioned-emissions-facility-aggregation.dto';
import { DailyApportionedEmissionsNationalAggregationDTO } from '../../src/dto/daily-apportioned-emissions-national-aggregation.dto';
import { DailyApportionedEmissionsStateAggregationDTO } from '../../src/dto/daily-apportioned-emissions-state-aggregation.dto';
import { HourlyApportionedEmissionsFacilityAggregationDTO } from '../../src/dto/hourly-apportioned-emissions-facility-aggregation.dto';
import { HourlyApportionedEmissionsNationalAggregationDTO } from '../../src/dto/hourly-apportioned-emissions-national-aggregation.dto';
import { HourlyApportionedEmissionsStateAggregationDTO } from '../../src/dto/hourly-apportioned-emissions-state-aggregation.dto';
import { MonthlyApportionedEmissionsFacilityAggregationDTO } from '../../src/dto/monthly-apportioned-emissions-facility-aggregation.dto';
import { MonthlyApportionedEmissionsNationalAggregationDTO } from '../../src/dto/monthly-apportioned-emissions-national-aggregation.dto';
import { MonthlyApportionedEmissionsStateAggregationDTO } from '../../src/dto/monthly-apportioned-emissions-state-aggregation.dto';
import { AnnualApportionedEmissionsFacilityAggregationDTO } from '../../src/dto/annual-apportioned-emissions-facility-aggregation.dto';
import { QuarterlyApportionedEmissionsFacilityAggregationDTO } from '../../src/dto/quarterly-apportioned-emissions-facility-aggregation.dto';
import { QuarterlyApportionedEmissionsStateAggregationDTO } from '../../src/dto/quarterly-apportioned-emissions-state-aggregation.dto';
import { QuarterlyApportionedEmissionsNationalAggregationDTO } from '../../src/dto/quarterly-apportioned-emissions-national-aggregation.dto';
import { ApplicableApportionedEmissionsAttributesDTO } from 'src/dto/applicable-apportioned-emissions-attributes.dto';

const apportionedEmissionsAggregationDTO = {
  grossLoad: faker.datatype.number(),
  steamLoad: faker.datatype.number(),
  so2Mass: faker.datatype.number(),
  co2Mass: faker.datatype.number(),
  noxMass: faker.datatype.number(),
  heatInput: faker.datatype.number(),
};

const annualApportionedEmissionsAggregationDTO = {
  ...apportionedEmissionsAggregationDTO,
  year: faker.datatype.number(),
};

const dailyApportionedEmissionsAggregationDTO = {
  ...apportionedEmissionsAggregationDTO,
  date: '2019-01-01',
};

const hourlyApportionedEmissionsAggregationDTO = {
  ...apportionedEmissionsAggregationDTO,
  date: '2019-01-01',
  hour: faker.datatype.number(),
};

const monthlyApportionedEmissionsAggregationDTO = {
  ...apportionedEmissionsAggregationDTO,
  year: faker.datatype.number(),
  month: faker.datatype.number(),
};

const quarterApportionedEmissionsAggregationDTO = {
  ...apportionedEmissionsAggregationDTO,
  year: faker.datatype.number(),
  quarter: faker.datatype.number(),
};

const facilityAggregation = {
  facilityId: faker.datatype.number(),
  facilityName: faker.datatype.string(),
  stateCode: faker.datatype.string(),
};

const stateAggregation = {
  stateCode: faker.datatype.string(),
};

const viewData = {
  stateCode: faker.datatype.string(),
  facilityName: faker.datatype.string(),
  facilityId: faker.datatype.number(),
  unitId: faker.datatype.number(),
  associatedStacks: faker.datatype.string(),
  sumOpTime: faker.datatype.number(),
  countOpTime: faker.datatype.number(),
  grossLoad: faker.datatype.number(),
  steamLoad: faker.datatype.number(),
  so2Mass: faker.datatype.number(),
  so2Rate: faker.datatype.number(),
  co2Mass: faker.datatype.number(),
  co2Rate: faker.datatype.number(),
  noxMass: faker.datatype.number(),
  noxRate: faker.datatype.number(),
  heatInput: faker.datatype.number(),
  primaryFuelInfo: faker.datatype.string(),
  secondaryFuelInfo: faker.datatype.string(),
  unitType: faker.datatype.string(),
  so2ControlInfo: faker.datatype.string(),
  noxControlInfo: faker.datatype.string(),
  pmControlInfo: faker.datatype.string(),
  hgControlInfo: faker.datatype.string(),
  programCodeInfo: faker.datatype.string(),
};

export const genAnnualApportionedEmissionsFacilityDto = (amount = 1) => {
  const dtos: AnnualApportionedEmissionsFacilityAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...annualApportionedEmissionsAggregationDTO,
      ...facilityAggregation,
    });
  }

  return dtos;
};

export const genAnnualApportionedEmissionsStateDto = (amount = 1) => {
  const dtos: AnnualApportionedEmissionsStateAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...annualApportionedEmissionsAggregationDTO,
      ...stateAggregation,
    });
  }

  return dtos;
};

export const genAnnualApportionedEmissionsNationalDto = (amount = 1) => {
  const dtos: AnnualApportionedEmissionsAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...annualApportionedEmissionsAggregationDTO,
    });
  }

  return dtos;
};

export const genAnnualUnitData = <RepoType>(amount = 1): RepoType[] => {
  const annualUnitData: RepoType[] = [];
  for (let annualValue = 0; annualValue < amount; annualValue++) {
    annualUnitData.push(({
      ...viewData,
      year: faker.datatype.number(),
    } as unknown) as RepoType);
  }
  return annualUnitData;
};

export const genDailyApportionedEmissionsFacilityDto = (amount = 1) => {
  const dtos: DailyApportionedEmissionsFacilityAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...dailyApportionedEmissionsAggregationDTO,
      ...facilityAggregation,
    });
  }

  return dtos;
};

export const genDailyApportionedEmissionsStateDto = (amount = 1) => {
  const dtos: DailyApportionedEmissionsStateAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...dailyApportionedEmissionsAggregationDTO,
      ...stateAggregation,
    });
  }

  return dtos;
};

export const genDailyApportionedEmissionsNationalDto = (amount = 1) => {
  const dtos: DailyApportionedEmissionsNationalAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...dailyApportionedEmissionsAggregationDTO,
    });
  }

  return dtos;
};

export const genDayUnitData = <RepoType>(amount = 1): RepoType[] => {
  const dayUnitData: RepoType[] = [];
  for (let dayValue = 0; dayValue < amount; dayValue++) {
    dayUnitData.push(({
      ...viewData,
      date: faker.datatype.datetime(),
    } as unknown) as RepoType);
  }
  return dayUnitData;
};

export const genHourlyApportionedEmissionsFacilityDto = (amount = 1) => {
  const dtos: HourlyApportionedEmissionsFacilityAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...hourlyApportionedEmissionsAggregationDTO,
      ...facilityAggregation,
    });
  }

  return dtos;
};

export const genHourlyApportionedEmissionsStateDto = (amount = 1) => {
  const dtos: HourlyApportionedEmissionsStateAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...hourlyApportionedEmissionsAggregationDTO,
      ...stateAggregation,
    });
  }

  return dtos;
};

export const genHourlyApportionedEmissionsNationalDto = (amount = 1) => {
  const dtos: HourlyApportionedEmissionsNationalAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...hourlyApportionedEmissionsAggregationDTO,
    });
  }

  return dtos;
};

export const genHourUnitData = <RepoType>(amount = 1): RepoType[] => {
  const hourUnitData: RepoType[] = [];
  for (let hourValue = 0; hourValue < amount; hourValue++) {
    hourUnitData.push(({
      ...viewData,
      date: faker.datatype.datetime(),
    } as unknown) as RepoType);
  }
  return hourUnitData;
};

export const genMonthlyApportionedEmissionsFacilityDto = (amount = 1) => {
  const dtos: MonthlyApportionedEmissionsFacilityAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...monthlyApportionedEmissionsAggregationDTO,
      ...facilityAggregation,
    });
  }

  return dtos;
};

export const genMonthlyApportionedEmissionsStateDto = (amount = 1) => {
  const dtos: MonthlyApportionedEmissionsStateAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...monthlyApportionedEmissionsAggregationDTO,
      ...stateAggregation,
    });
  }

  return dtos;
};

export const genMonthlyApportionedEmissionsNationalDto = (amount = 1) => {
  const dtos: MonthlyApportionedEmissionsNationalAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...monthlyApportionedEmissionsAggregationDTO,
    });
  }

  return dtos;
};

export const genMonthUnitData = <RepoType>(amount = 1): RepoType[] => {
  const monthUnitData: RepoType[] = [];
  for (let monthValue = 0; monthValue < amount; monthValue++) {
    monthUnitData.push(({
      ...viewData,
      date: faker.datatype.datetime(),
    } as unknown) as RepoType);
  }
  return monthUnitData;
};

export const genQuarterlyApportionedEmissionsFacilityDto = (amount = 1) => {
  const dtos: QuarterlyApportionedEmissionsFacilityAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...quarterApportionedEmissionsAggregationDTO,
      ...facilityAggregation,
    });
  }

  return dtos;
};

export const genQuarterlyApportionedEmissionsStateDto = (amount = 1) => {
  const dtos: QuarterlyApportionedEmissionsStateAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...quarterApportionedEmissionsAggregationDTO,
      ...stateAggregation,
    });
  }

  return dtos;
};

export const genQuarterlyApportionedEmissionsNationalDto = (amount = 1) => {
  const dtos: QuarterlyApportionedEmissionsNationalAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...quarterApportionedEmissionsAggregationDTO,
    });
  }

  return dtos;
};

export const genQuarterUnitData = <RepoType>(amount = 1): RepoType[] => {
  const quarterUnitData: RepoType[] = [];
  for (let quarterValue = 0; quarterValue < amount; quarterValue++) {
    quarterUnitData.push(({
      ...viewData,
      date: faker.datatype.datetime(),
    } as unknown) as RepoType);
  }
  return quarterUnitData;
};

export const genApplicableApportionedEmissionsAttributesDto = (amount = 1) => {
  const dtos: ApplicableApportionedEmissionsAttributesDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      year: faker.datatype.number(),
      programCode: faker.datatype.string(),
      facilityId: faker.datatype.number(),
      stateCode: faker.datatype.string(),
      unitTypeCode: faker.datatype.string(),
      fuelTypeCode: faker.datatype.string(),
      controlCode: faker.datatype.string(),
    });
  }

  return dtos;
};

export const genHourUnitMatsDataView = <RepoType>(amount = 1): RepoType[] => {
  const hourUnitMatsData: RepoType[] = [];
  for (let hourlyMatsValue = 0; hourlyMatsValue < amount; hourlyMatsValue++) {
    hourUnitMatsData.push(({
      stateCode: faker.datatype.string(),
      facilityName: faker.datatype.string(),
      facilityId: faker.datatype.number(),
      unitId: faker.datatype.string(),
      date: faker.datatype.datetime(),
      hour: faker.datatype.number(),
      opTime: faker.datatype.number(),
      matsGrossLoad: faker.datatype.number(),
      matsHeatInput: faker.datatype.number(),
      hgOutputRate: faker.datatype.number(),
      hgInputRate: faker.datatype.number(),
      hgMass: faker.datatype.number(),
      hgMassMeasureFlg: faker.datatype.string(),
      hclOutputRate: faker.datatype.number(),
      hclInputRate: faker.datatype.number(),
      hclMass: faker.datatype.number(),
      hclMassMeasureFlg: faker.datatype.string(),
      hfOutputRate: faker.datatype.number(),
      hfInputRate: faker.datatype.number(),
      hfMass: faker.datatype.number(),
      hfMassMeasureFlg: faker.datatype.string(),
      associatedStacks: faker.datatype.string(),
      steamLoad: faker.datatype.number(),
      primaryFuelInfo: faker.datatype.string(),
      secondaryFuelInfo: faker.datatype.string(),
      unitType: faker.datatype.string(),
      so2ControlInfo: faker.datatype.string(),
      noxControlInfo: faker.datatype.string(),
      pmControlInfo: faker.datatype.string(),
      hgControlInfo: faker.datatype.string(),
    } as unknown) as RepoType);
  }
  return hourUnitMatsData;
};
