import { emissionsFields } from './emissions-fields';

export const fieldMappings = {
  emissions: {
    hourly: [
      { ...emissionsFields.state },
      { ...emissionsFields.facilityName },
      { ...emissionsFields.orisCode },
      { ...emissionsFields.unitId },
      { ...emissionsFields.assocStacks },
      { ...emissionsFields.opDate },
      { ...emissionsFields.opHour },
      { ...emissionsFields.opTime },
      { ...emissionsFields.gloadHrly },
      { ...emissionsFields.sloadHrly },
      { ...emissionsFields.so2MassHrly },
      { ...emissionsFields.so2MassMeasureFlg },
      { ...emissionsFields.so2Rate },
      { ...emissionsFields.so2RateMeasureFlg },
      { ...emissionsFields.noxMassHrly },
      { ...emissionsFields.noxMassMeasureFlg },
      { ...emissionsFields.noxRate },
      { ...emissionsFields.noxRateMeasureFlg },
      { ...emissionsFields.co2Mass },
      { ...emissionsFields.co2MassMeasureFlg },
      { ...emissionsFields.co2Rate },
      { ...emissionsFields.co2RateMeasureFlg },
      { ...emissionsFields.heatInput },
      { ...emissionsFields.primaryFuels },
      { ...emissionsFields.secondaryFuels },
      { ...emissionsFields.unitTypes },
      { ...emissionsFields.so2Controls },
      { ...emissionsFields.pmControls },
      { ...emissionsFields.noxControls },
      { ...emissionsFields.hgControls },
      { ...emissionsFields.programs },
    ],
    daily: [
      { ...emissionsFields.state },
      { ...emissionsFields.facilityName },
      { ...emissionsFields.orisCode },
      { ...emissionsFields.unitId },
      { ...emissionsFields.assocStacks },
      { ...emissionsFields.opDate },
      { ...emissionsFields.sumOpTime },
      { ...emissionsFields.countOpTime },
      { ...emissionsFields.gload },
      { ...emissionsFields.sload },
      { ...emissionsFields.so2Mass },
      { ...emissionsFields.so2Rate },
      { ...emissionsFields.noxMass },
      { ...emissionsFields.noxRate },
      { ...emissionsFields.co2Mass },
      { ...emissionsFields.co2Rate },
      { ...emissionsFields.heatInput },
      { ...emissionsFields.primaryFuels },
      { ...emissionsFields.secondaryFuels },
      { ...emissionsFields.unitTypes },
      { ...emissionsFields.so2Controls },
      { ...emissionsFields.pmControls },
      { ...emissionsFields.noxControls },
      { ...emissionsFields.hgControls },
      { ...emissionsFields.programs },
    ],
    monthly: [
      { ...emissionsFields.state },
      { ...emissionsFields.facilityName },
      { ...emissionsFields.orisCode },
      { ...emissionsFields.unitId },
      { ...emissionsFields.assocStacks },
      { ...emissionsFields.opYear },
      { ...emissionsFields.opMonth },
      { ...emissionsFields.sumOpTime },
      { ...emissionsFields.countOpTime },
      { ...emissionsFields.gload },
      { ...emissionsFields.sload },
      { ...emissionsFields.so2Mass },
      { ...emissionsFields.so2Rate },
      { ...emissionsFields.noxMass },
      { ...emissionsFields.noxRate },
      { ...emissionsFields.co2Mass },
      { ...emissionsFields.co2Rate },
      { ...emissionsFields.heatInput },
      { ...emissionsFields.primaryFuels },
      { ...emissionsFields.secondaryFuels },
      { ...emissionsFields.unitTypes },
      { ...emissionsFields.so2Controls },
      { ...emissionsFields.pmControls },
      { ...emissionsFields.noxControls },
      { ...emissionsFields.hgControls },
      { ...emissionsFields.programs },
    ],
    quarterly: [
      { ...emissionsFields.state },
      { ...emissionsFields.facilityName },
      { ...emissionsFields.orisCode },
      { ...emissionsFields.unitId },
      { ...emissionsFields.assocStacks },
      { ...emissionsFields.opYear },
      { ...emissionsFields.opQuarter },
      { ...emissionsFields.sumOpTime },
      { ...emissionsFields.countOpTime },
      { ...emissionsFields.gload },
      { ...emissionsFields.sload },
      { ...emissionsFields.so2Mass },
      { ...emissionsFields.so2Rate },
      { ...emissionsFields.noxMass },
      { ...emissionsFields.noxRate },
      { ...emissionsFields.co2Mass },
      { ...emissionsFields.co2Rate },
      { ...emissionsFields.heatInput },
      { ...emissionsFields.primaryFuels },
      { ...emissionsFields.secondaryFuels },
      { ...emissionsFields.unitTypes },
      { ...emissionsFields.so2Controls },
      { ...emissionsFields.pmControls },
      { ...emissionsFields.noxControls },
      { ...emissionsFields.hgControls },
      { ...emissionsFields.programs },
    ],
    annual: [
      { ...emissionsFields.state },
      { ...emissionsFields.facilityName },
      { ...emissionsFields.orisCode },
      { ...emissionsFields.unitId },
      { ...emissionsFields.assocStacks },
      { ...emissionsFields.opYear },
      { ...emissionsFields.sumOpTime },
      { ...emissionsFields.countOpTime },
      { ...emissionsFields.gload },
      { ...emissionsFields.sload },
      { ...emissionsFields.so2Mass },
      { ...emissionsFields.so2Rate },
      { ...emissionsFields.noxMass },
      { ...emissionsFields.noxRate },
      { ...emissionsFields.co2Mass },
      { ...emissionsFields.co2Rate },
      { ...emissionsFields.heatInput },
      { ...emissionsFields.primaryFuels },
      { ...emissionsFields.secondaryFuels },
      { ...emissionsFields.unitTypes },
      { ...emissionsFields.so2Controls },
      { ...emissionsFields.pmControls },
      { ...emissionsFields.noxControls },
      { ...emissionsFields.hgControls },
      { ...emissionsFields.programs },
    ],
    ozone: [],
  },
};
