import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

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
      const expectedResult = genApplicableApportionedEmissionsAttributesDto();
      jest
        .spyOn(service, 'getApplicableApportionedEmissionsAttributes')
        .mockResolvedValue(expectedResult);
      expect(
        await controller.getApplicableApportionedEmissionsAttributes(null),
      ).toBe(expectedResult);
    });
  });
});
