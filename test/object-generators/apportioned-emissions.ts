import { faker } from '@faker-js/faker';
import { ApplicableApportionedEmissionsAttributesDTO } from 'src/dto/applicable-apportioned-emissions-attributes.dto';

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