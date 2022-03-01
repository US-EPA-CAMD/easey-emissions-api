import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

const hourly = [];
const daily = [];
const monthly = [];
const quarterly = [];
const annual = [];
const hourlyMats = [];

const commonCharacteristics = [
  { ...propertyMetadata.stateCode.fieldLabels },
  { ...propertyMetadata.facilityName.fieldLabels },
  { ...propertyMetadata.facilityId.fieldLabels },
  { ...propertyMetadata.unitId.fieldLabels },
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
];

const controlInfoCharacteristics = [
  { ...propertyMetadata.so2ControlInfo.fieldLabels },
  { ...propertyMetadata.pmControlInfo.fieldLabels },
  { ...propertyMetadata.noxControlInfo.fieldLabels },
  { ...propertyMetadata.hgControlInfo.fieldLabels },
  { ...propertyMetadata.programCodeInfo.fieldLabels },
];

const hourlyCharacteristics = [
  { ...propertyMetadata.date.fieldLabels },
  { ...propertyMetadata.hour.fieldLabels },
  { ...propertyMetadata.opTime.fieldLabels },
];

hourly.push(
  ...commonCharacteristics,
  { ...propertyMetadata.associatedStacks.fieldLabels },
  ...hourlyCharacteristics,
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
  ...controlInfoCharacteristics,
);

daily.push(
  ...commonCharacteristics,
  { ...propertyMetadata.associatedStacks.fieldLabels },
  { ...propertyMetadata.date.fieldLabels },
  ...commonEmissions,
  ...unitCharacteristics,
  ...controlInfoCharacteristics,
);
monthly.push(
  ...commonCharacteristics,
  { ...propertyMetadata.associatedStacks.fieldLabels },
  { ...propertyMetadata.year.fieldLabels },
  { ...propertyMetadata.month.fieldLabels },
  ...commonEmissions,
  ...unitCharacteristics,
  ...controlInfoCharacteristics,
);
quarterly.push(
  ...commonCharacteristics,
  { ...propertyMetadata.associatedStacks.fieldLabels },
  { ...propertyMetadata.year.fieldLabels },
  { ...propertyMetadata.quarter.fieldLabels },
  ...commonEmissions,
  ...unitCharacteristics,
  ...controlInfoCharacteristics,
);
annual.push(
  ...commonCharacteristics,
  { ...propertyMetadata.associatedStacks.fieldLabels },
  { ...propertyMetadata.year.fieldLabels },
  ...commonEmissions,
  ...unitCharacteristics,
  ...controlInfoCharacteristics,
);
hourlyMats.push(
  ...commonCharacteristics,
  ...hourlyCharacteristics,
  { ...propertyMetadata.matsGrossLoad.fieldLabels },
  { ...propertyMetadata.matsHeatInput.fieldLabels },
  { ...propertyMetadata.hgOutputRate.fieldLabels },
  { ...propertyMetadata.hgInputRate.fieldLabels },
  { ...propertyMetadata.hgMass.fieldLabels },
  { ...propertyMetadata.hgMassMeasureFlg.fieldLabels },
  { ...propertyMetadata.hclOutputRate.fieldLabels },
  { ...propertyMetadata.hclInputRate.fieldLabels },
  { ...propertyMetadata.hclMass.fieldLabels },
  { ...propertyMetadata.hclMassMeasureFlg.fieldLabels },
  { ...propertyMetadata.hfOutputRate.fieldLabels },
  { ...propertyMetadata.hfInputRate.fieldLabels },
  { ...propertyMetadata.hfMass.fieldLabels },
  { ...propertyMetadata.hfMassMeasureFlg.fieldLabels },
  { ...propertyMetadata.associatedStacks.fieldLabels },
  { ...propertyMetadata.steamLoadHourly.fieldLabels },
  ...unitCharacteristics,
  { ...propertyMetadata.so2ControlInfo.fieldLabels },
  { ...propertyMetadata.noxControlInfo.fieldLabels },
  { ...propertyMetadata.pmControlInfo.fieldLabels },
  { ...propertyMetadata.hgControlInfo.fieldLabels },
);

export const fieldMappings = {
  emissions: {
    hourly: hourly,
    daily: daily,
    monthly: monthly,
    quarterly: quarterly,
    annual: annual,
    ozone: annual,
    mats: {
      hourly: hourlyMats,
    },
  },
};
