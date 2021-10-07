import { propertyMetadata } from '@us-epa-camd/easey-constants';

const hourly = [];
const daily = [];
const monthly = [];
const quarterly = [];
const annual = [];

const commonCharacteristics = [
  { ...propertyMetadata.state.fieldLabels },
  { ...propertyMetadata.facilityName.fieldLabels },
  { ...propertyMetadata.facilityId.fieldLabels },
  { ...propertyMetadata.unitId.fieldLabels },
  { ...propertyMetadata.associatedStacks.fieldLabels },
];

const commonEmissions = [
  { ...propertyMetadata.sumOpTime.fieldLabels },
  { ...propertyMetadata.countOpTime.fieldLabels },
  { ...propertyMetadata.grossLoad.fieldLabels },
  { ...propertyMetadata.steamLoad.fieldLabels },
  { ...propertyMetadata.so2Mass.fieldLabels },
  { ...propertyMetadata.so2Rate.fieldLabels },
  { ...propertyMetadata.noxMass.fieldLabels },
  { ...propertyMetadata.noxRate.fieldLabels },
  { ...propertyMetadata.co2Mass.fieldLabels },
  { ...propertyMetadata.co2Rate.fieldLabels },
  { ...propertyMetadata.heatInput.fieldLabels },
];

const unitCharacteristics = [
  { ...propertyMetadata.primaryFuelInfo.fieldLabels },
  { ...propertyMetadata.secondaryFuelInfo.fieldLabels },
  { ...propertyMetadata.unitType.fieldLabels },
  { ...propertyMetadata.so2ControlInfo.fieldLabels },
  { ...propertyMetadata.pmControlInfo.fieldLabels },
  { ...propertyMetadata.noxControlInfo.fieldLabels },
  { ...propertyMetadata.hgControlInfo.fieldLabels },
  { ...propertyMetadata.programCodeInfo.fieldLabels },
];

hourly.push(
  ...commonCharacteristics,
  { ...propertyMetadata.date.fieldLabels },
  { ...propertyMetadata.hour.fieldLabels },
  { ...propertyMetadata.opTime.fieldLabels },
  { ...propertyMetadata.grossLoadHourly.fieldLabels },
  { ...propertyMetadata.steamLoadHourly.fieldLabels },
  { ...propertyMetadata.so2MassHourly.fieldLabels },
  { ...propertyMetadata.so2MassMeasureFlg.fieldLabels },
  { ...propertyMetadata.so2Rate.fieldLabels },
  { ...propertyMetadata.so2RateMeasureFlg.fieldLabels },
  { ...propertyMetadata.noxMassHourly.fieldLabels },
  { ...propertyMetadata.noxMassMeasureFlg.fieldLabels },
  { ...propertyMetadata.noxRate.fieldLabels },
  { ...propertyMetadata.noxRateMeasureFlg.fieldLabels },
  { ...propertyMetadata.co2Mass.fieldLabels },
  { ...propertyMetadata.co2MassMeasureFlg.fieldLabels },
  { ...propertyMetadata.co2Rate.fieldLabels },
  { ...propertyMetadata.co2RateMeasureFlg.fieldLabels },
  { ...propertyMetadata.heatInput.fieldLabels },
  ...unitCharacteristics,
);

daily.push(
  ...commonCharacteristics,
  { ...propertyMetadata.date.fieldLabels },
  ...commonEmissions,
  ...unitCharacteristics,
);
monthly.push(
  ...commonCharacteristics,
  { ...propertyMetadata.year.fieldLabels },
  { ...propertyMetadata.month.fieldLabels },
  ...commonEmissions,
  ...unitCharacteristics,
);
quarterly.push(
  ...commonCharacteristics,
  { ...propertyMetadata.year.fieldLabels },
  { ...propertyMetadata.quarter.fieldLabels },
  ...commonEmissions,
  ...unitCharacteristics,
);
annual.push(
  ...commonCharacteristics,
  { ...propertyMetadata.year.fieldLabels },
  ...commonEmissions,
  ...unitCharacteristics,
);

export const fieldMappings = {
  emissions: {
    hourly: hourly,
    daily: daily,
    monthly: monthly,
    quarterly: quarterly,
    annual: annual,
    ozone: annual,
  },
};
