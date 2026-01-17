import { Test } from '@nestjs/testing';
import { Logger, LoggerModule } from '@us-epa-camd/easey-common/logger';
import { DataSource, EntityManager } from 'typeorm';

import { genApplicableApportionedEmissionsAttributesDto } from '../../../test/object-generators/apportioned-emissions';
import { ApplicableApportionedEmissionsAttributesParamsDTO } from '../../dto/applicable-apportioned-emissions-attributes.params.dto';
import { MatsApportionedEmissionsService } from './mats-apportioned-emissions.service';

const mockRepository = {
  getApplicableApportionedEmissionsAttributes: jest.fn(), // Fix method name
};

const mockRequest = () => {
  return {
    headers: { accept: '' },
    res: {
      setHeader: jest.fn(),
    },
  };
};

jest.mock('../unit-fact.repository', () => ({
  UnitFactRepository: jest.fn().mockImplementation(() => mockRepository),
}));

describe('-- MATS Apportioned Emissions Service --', () => {
  let service: MatsApportionedEmissionsService;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        EntityManager,
        MatsApportionedEmissionsService,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              isReleased: false,
              manager: {},
            }),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
            setContext: jest.fn(),
          },
        }
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();
    service = module.get(MatsApportionedEmissionsService);
  });

  describe('getApplicableEmissions', () => {
    it('calls UnitFactRepository.getApplicableApportionedEmissionsAttributes() and gets all applicable emissions attributes from the repository', async () => {
      const expected = genApplicableApportionedEmissionsAttributesDto();
      mockRepository.getApplicableApportionedEmissionsAttributes.mockResolvedValue(expected); // Use mock directly
      const filters = new ApplicableApportionedEmissionsAttributesParamsDTO();

      const result = await service.getApplicableApportionedEmissionsAttributes(
        filters,
      );
      expect(result).toEqual(expected);
    });
  });
});
