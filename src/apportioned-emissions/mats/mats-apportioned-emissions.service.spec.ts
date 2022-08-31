import { Test } from '@nestjs/testing';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MatsApportionedEmissionsService } from './mats-apportioned-emissions.service';
import { HourUnitMatsDataRepository } from './hourly/hour-unit-mats-data.repository';
import { HourUnitMatsDataArch } from '../../entities/hour-unit-mats-data-arch.entity';
import { ApplicableApportionedEmissionsAttributesParamsDTO } from '../../dto/applicable-apportioned-emissions-attributes.params.dto';
import { ProgramYearDimRepository } from '../program-year-dim.repository';

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

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MatsApportionedEmissionsService,
        {
          provide: HourUnitMatsDataRepository,
          useFactory: mockRepository,
        },
        {
          provide: ProgramYearDimRepository,
          useValue: programYearRepositoryMock,
        },
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();
    service = module.get(MatsApportionedEmissionsService);
    repository = module.get(HourUnitMatsDataRepository);
  });

  describe('getApplicableEmissions', () => {
    it('calls HourUnitDataRepository.getApplicableEmissions() and gets all applicable emissions attributes from the repository', async () => {
      const expected: HourUnitMatsDataArch[] = [];
      repository.getApplicableEmissions.mockResolvedValue(expected);
      repository.lastArchivedDate.mockResolvedValue('2019-01-01');
      const filters = new ApplicableApportionedEmissionsAttributesParamsDTO();

      jest
        .spyOn(
          programYearRepositoryMock,
          'getApplicableApportionedEmissionsAttributes',
        )
        // @ts-expect-error Allow empty array
        .mockResolvedValue([]);
      const result = await service.getApplicableApportionedEmissionsAttributes(
        filters,
      );
      expect(result).toEqual(expected);
    });
  });
});
