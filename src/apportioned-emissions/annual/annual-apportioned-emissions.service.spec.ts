import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { AnnualApportionedEmissionsService } from './annual-apportioned-emissions.service';
import { AnnualApportionedEmissionsMap } from '../../maps/annual-apportioned-emissions.map';
import { AnnualApportionedEmissionsDTO } from '../../dto/annual-apportioned-emissions.dto';
import { 
  AnnualApportionedEmissionsParamsDTO,
  PaginatedAnnualApportionedEmissionsParamsDTO,
} from '../../dto/annual-apportioned-emissions.params.dto';

const mockRepository = () => ({
  getEmissions: jest.fn(),
});

const mockMap = () => ({
  many: jest.fn(),
});

const mockRequest = () => {
  return {
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Annual Apportioned Emissions Service --', () => {
  let service: AnnualApportionedEmissionsService;
  let repository: any;
  let map: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        AnnualApportionedEmissionsService,
        {
          provide: AnnualUnitDataRepository,
          useFactory: mockRepository,
        },
        {
          provide: AnnualApportionedEmissionsMap,
          useFactory: mockMap
        },
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();    
    service = module.get(AnnualApportionedEmissionsService);
    repository = module.get(AnnualUnitDataRepository);
    map = module.get(AnnualApportionedEmissionsMap);
  });

  describe('getEmissions', () => {
    it('calls AnnualUnitDataRepository.getEmissions() and gets all emissions from the repository', async () => {
      repository.getEmissions.mockResolvedValue(
        'list of emissions',
      );
      const dto = new AnnualApportionedEmissionsDTO();
      map.many.mockReturnValue(dto);

      let filters = new PaginatedAnnualApportionedEmissionsParamsDTO();

      let result = await service.getEmissions(req, filters);

      expect(map.many).toHaveBeenCalled();
      expect(result).toEqual(dto);
    });
  });

  // describe('streamEmissions', () => {
  //   it('calls AnnualUnitDataRepository.streamEmissions() and streams all emissions from the repository', async () => {
  //     repository.streamEmissions.mockResolvedValue(
  //       'stream of emissions',
  //     );
  //     //const expectedResult = new StreamableFile(new ReadStream());

  //     let filters = new AnnualApportionedEmissionsParamsDTO();

  //     let result = await service.streamEmissions(req, filters);

  //     //expect(map.many).toHaveBeenCalled();
  //     //expect(result).toEqual(dto);
  //   });
  // });
});
