import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';


import { MatsApportionedEmissionsService } from './mats-apportioned-emissions.service';
import { ApplicableMatsApportionedEmissionsAttributesParamsDTO } from '../../dto/applicable-mats-apportioned-emissions-attributes-params.dto';
import { HourUnitMatsDataRepository } from './hourly/hour-unit-mats-data.repository';
import { HourUnitMatsDataArch } from '../../entities/hour-unit-mats-data-arch.entity';

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
      repository.lastArchivedDate.mockResolvedValue('2019-01-01')
      let filters = new ApplicableMatsApportionedEmissionsAttributesParamsDTO();
      let result = await service.getApplicableEmissions(filters);
      expect(result).toEqual(expected);
    });
  });
});
