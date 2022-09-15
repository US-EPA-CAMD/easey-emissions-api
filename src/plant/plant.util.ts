import { PlantRepository } from './plant.repository';
import { isUndefinedOrNull } from '../utils/utils';
import { NotFoundException } from '@nestjs/common';

export type ImportData = {
  stackPipeIds: string[];
  unitIds: string[];
};

export const getLocationData = async (orisCode: number, data: ImportData) => {
  const plantRepository = new PlantRepository();

  const plantLocation = await plantRepository.getImportLocations({
    orisCode,
    stackIds: data.stackPipeIds,
    unitIds: data.unitIds,
  });

  if (isUndefinedOrNull(plantLocation)) {
    throw new NotFoundException('Plant not found.');
  }

  return plantLocation;
};
