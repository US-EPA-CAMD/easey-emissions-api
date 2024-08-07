import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

import { genApplicableApportionedEmissionsAttributesDto } from '../../../test/object-generators/apportioned-emissions';
import { ApplicableApportionedEmissionsAttributesParamsDTO } from '../../dto/applicable-apportioned-emissions-attributes.params.dto';
import { UnitFactRepository } from '../unit-fact.repository';
import { HourUnitMatsDataRepository } from './hourly/hour-unit-mats-data.repository';
import { MatsApportionedEmissionsService } from './mats-apportioned-emissions.service';

const mockRepository = () => ({
  getApplicableEmissions: jest.fn(),
  lastArchivedDate: jest.fn(),
});

const mockRequest = () => {
  return {
    headers: { accept: '' },
    res: {
      setHeader: jest.fn(),
    },
  };
};

const programYearRepositoryMock = {
  getApplicableApportionedEmissionsAttributes: () => jest,
};

describe('-- MATS Apportioned Emissions Service --', () => {
  let service: MatsApportionedEmissionsService;
  let repository: any;
  let req: any;
  let unitFactRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        EntityManager,
        MatsApportionedEmissionsService,
        UnitFactRepository,
        {
          provide: HourUnitMatsDataRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();
    service = module.get(MatsApportionedEmissionsService);
    repository = module.get(HourUnitMatsDataRepository);
    unitFactRepository = module.get(UnitFactRepository);
  });

  describe('getApplicableEmissions', () => {
    it('calls HourUnitDataRepository.getApplicableEmissions() and gets all applicable emissions attributes from the repository', async () => {
      const expected = genApplicableApportionedEmissionsAttributesDto();
      repository.getApplicableEmissions.mockResolvedValue(expected);
      repository.lastArchivedDate.mockResolvedValue('2019-01-01');
      const filters = new ApplicableApportionedEmissionsAttributesParamsDTO();

      jest
        .spyOn(
          programYearRepositoryMock,
          'getApplicableApportionedEmissionsAttributes',
        )
        // @ts-expect-error Allow empty array
        .mockResolvedValue(expected);

      jest
        .spyOn(
          unitFactRepository,
          'getApplicableApportionedEmissionsAttributes',
        )
        .mockResolvedValue(expected);
      const result = await service.getApplicableApportionedEmissionsAttributes(
        filters,
      );
      expect(result).toEqual(expected);
    });
  });
});
