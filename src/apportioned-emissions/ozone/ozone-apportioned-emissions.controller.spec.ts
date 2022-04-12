import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { OzoneUnitDataView } from '../../entities/vw-ozone-unit-data.entity';
import { OzoneUnitDataRepository } from './ozone-unit-data.repository';
import { OzoneApportionedEmissionsService } from './ozone-apportioned-emissions.service';
import { OzoneApportionedEmissionsController } from './ozone-apportioned-emissions.controller';

import {
  OzoneApportionedEmissionsParamsDTO,
  PaginatedOzoneApportionedEmissionsParamsDTO,
} from '../../dto/ozone-apportioned-emissions.params.dto';
import { StreamModule } from '@us-epa-camd/easey-common/stream';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Ozone Apportioned Emissions Controller --', () => {
  let controller: OzoneApportionedEmissionsController;
  let service: OzoneApportionedEmissionsService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, StreamModule],
      controllers: [OzoneApportionedEmissionsController],
      providers: [OzoneApportionedEmissionsService, OzoneUnitDataRepository],
    }).compile();

    controller = module.get(OzoneApportionedEmissionsController);
    service = module.get(OzoneApportionedEmissionsService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* getEmissions', () => {
    it('should return test 1', async () => {
      const expectedResult: OzoneUnitDataView[] = [];
      const paramsDto = new PaginatedOzoneApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'getEmissions').mockResolvedValue(expectedResult);
      expect(await controller.getEmissions(req, paramsDto)).toBe(
        expectedResult,
      );
    });
  });

  describe('* streamEmissions', () => {
    it('should return test 1', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new OzoneApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'streamEmissions').mockResolvedValue(expectedResult);
      expect(await controller.streamEmissions(req, paramsDto)).toBe(
        expectedResult,
      );
    });
  });
});
