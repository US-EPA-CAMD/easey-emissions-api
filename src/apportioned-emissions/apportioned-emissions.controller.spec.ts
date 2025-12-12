import { Test } from '@nestjs/testing';
import { Logger, LoggerModule } from '@us-epa-camd/easey-common/logger';
import { DataSource, EntityManager } from 'typeorm';

import { genApplicableApportionedEmissionsAttributesDto } from '../../test/object-generators/apportioned-emissions';
import { ApportionedEmissionsController } from './apportioned-emissions.controller';
import { ApportionedEmissionsService } from './apportioned-emissions.service';
import { UnitFactRepository } from './unit-fact.repository';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Apportioned Emissions Controller --', () => {
  let controller: ApportionedEmissionsController;
  let service: ApportionedEmissionsService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [ApportionedEmissionsController],
      providers: [
        EntityManager,
        ApportionedEmissionsService,
        UnitFactRepository,
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

    controller = module.get(ApportionedEmissionsController);
    service = module.get(ApportionedEmissionsService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* getApplicableApportionedEmissionsAttributes', () => {
    it('should return a list of Applicable Apportioned Emissions Attributes', async () => {
      const applicableApportionedEmissionsAttributes = genApplicableApportionedEmissionsAttributesDto();
      const expectedResult = {
        items: applicableApportionedEmissionsAttributes
      }
      jest
        .spyOn(service, 'getApplicableApportionedEmissionsAttributes')
        .mockResolvedValue(applicableApportionedEmissionsAttributes);
      expect(
        await controller.getApplicableApportionedEmissionsAttributes(null),
      ).toEqual(expectedResult);
    });
  });
});
