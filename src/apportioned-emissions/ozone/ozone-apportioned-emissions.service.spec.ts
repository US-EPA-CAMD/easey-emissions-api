import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { OzoneUnitDataView } from '../../entities/vw-ozone-unit-data.entity';
import { OzoneUnitDataRepository } from './ozone-unit-data.repository';
import { OzoneApportionedEmissionsService } from './ozone-apportioned-emissions.service';

import { 
  OzoneApportionedEmissionsParamsDTO,
  PaginatedOzoneApportionedEmissionsParamsDTO,
} from '../../dto/ozone-apportioned-emissions.params.dto';

const mockRepository = () => ({
  getEmissions: jest.fn(),
});

const mockRequest = () => {
  return {
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Ozone Apportioned Emissions Service --', () => {
  let service: OzoneApportionedEmissionsService;
  let repository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        OzoneApportionedEmissionsService,
        {
          provide: OzoneUnitDataRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();    
    service = module.get(OzoneApportionedEmissionsService);
    repository = module.get(OzoneUnitDataRepository);
  });

  describe('getEmissions', () => {
    it('calls OzoneUnitDataRepository.getEmissions() and gets all emissions from the repository', async () => {
      const expected = OzoneUnitDataView[0];
      repository.getEmissions.mockResolvedValue(expected);
      let filters = new PaginatedOzoneApportionedEmissionsParamsDTO();
      let result = await service.getEmissions(req, filters);
      expect(result).toEqual(expected);
    });
  });

  describe('streamEmissions', () => {
    it('calls OzoneUnitDataRepository.streamEmissions() and streams all emissions from the repository', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      repository.streamEmissions.mockResolvedValue(expectedResult);
      let filters = new OzoneApportionedEmissionsParamsDTO();
      let result = await service.streamEmissions(req, filters);
      expect(result).toEqual(expectedResult);
    });
  });
});