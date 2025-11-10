import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Logger, LoggerModule } from '@us-epa-camd/easey-common/logger';
import { DataSource, EntityManager } from 'typeorm';

import {
  genDailyApportionedEmissionsFacilityDto,
  genDailyApportionedEmissionsNationalDto,
  genDailyApportionedEmissionsStateDto,
  genQuarterUnitData,
} from '../../../test/object-generators/apportioned-emissions';
import { PaginatedQuarterlyApportionedEmissionsParamsDTO } from '../../dto/quarterly-apportioned-emissions.params.dto';
import { QuarterUnitDataView } from '../../entities/vw-quarter-unit-data.entity';
import { HourlyFuelFlowRepository } from '../../hourly-fuel-flow/hourly-fuel-flow.repository';
import { HourlyFuelFlowService } from '../../hourly-fuel-flow/hourly-fuel-flow.service';
import { HourlyParameterFuelFlowRepository } from '../../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.repository';
import { HourlyParameterFuelFlowService } from '../../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.service';
import { HourlyFuelFlowMap } from '../../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowMap } from '../../maps/hourly-parameter-fuel-flow.map';
import { QuarterlyApportionedEmissionsService } from './quarterly-apportioned-emissions.service';

const mockRepository = {
  getEmissions: jest.fn(),
  getEmissionsFacilityAggregation: jest.fn(),
  getEmissionsStateAggregation: jest.fn(),
  getEmissionsNationalAggregation: jest.fn(),
};
jest.mock('./quarter-unit-data.repository', () => ({
  QuarterUnitDataRepository: jest.fn().mockImplementation(() => mockRepository),
}));

const mockRequest = () => {
  return {
    headers: {
      accept: '',
    },
    res: {
      setHeader: jest.fn(),
    },
    on: jest.fn(),
  };
};

describe('-- Quarterly Apportioned Emissions Service --', () => {
  let service: QuarterlyApportionedEmissionsService;
  let repository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        ConfigService,
        EntityManager,
        QuarterlyApportionedEmissionsService,
        HourlyFuelFlowService,
        HourlyFuelFlowRepository,
        HourlyFuelFlowMap,
        HourlyParameterFuelFlowService,
        HourlyParameterFuelFlowRepository,
        HourlyParameterFuelFlowMap,
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
    service = module.get(QuarterlyApportionedEmissionsService);
    repository = mockRepository;
  });

  describe('getEmissions', () => {
    it('calls QuarterUnitDataRepository.getEmissions() and gets all emissions from the repository', async () => {
      const expected = genQuarterUnitData<QuarterUnitDataView>();
      repository.getEmissions.mockResolvedValue(expected);
      const filters = new PaginatedQuarterlyApportionedEmissionsParamsDTO();
      const result = await service.getEmissions(req, filters);
      expect(result).toEqual(expected);
    });

    describe('getEmissionsFacilityAggregation', () => {
      it('calls AnnualUnitDataRepository.getEmissionsFacilityAggregation() and gets all emissions from the repository', async () => {
        const expected = genDailyApportionedEmissionsFacilityDto();
        repository.getEmissionsFacilityAggregation.mockResolvedValue(expected);
        const filters = new PaginatedQuarterlyApportionedEmissionsParamsDTO();
        const result = await service.getEmissionsFacilityAggregation(
          req,
          filters,
        );
        expect(result).toEqual(expected);
      });
    });
  });

  describe('getEmissionsStateAggregation', () => {
    it('calls QuarterUnitDataRepository.getEmissionsStateAggregation() and gets all emissions from the repository', async () => {
      const expected = genDailyApportionedEmissionsStateDto();
      repository.getEmissionsStateAggregation.mockResolvedValue(expected);
      const filters = new PaginatedQuarterlyApportionedEmissionsParamsDTO();
      const result = await service.getEmissionsStateAggregation(req, filters);
      expect(result).toEqual(expected);
    });
  });

  describe('getEmissionsNationalAggregation', () => {
    it('calls QuarterUnitDataRepository.getEmissionsNationalAggregation() and gets all emissions from the repository', async () => {
      const expected = genDailyApportionedEmissionsNationalDto();
      repository.getEmissionsNationalAggregation.mockResolvedValue(expected);
      const filters = new PaginatedQuarterlyApportionedEmissionsParamsDTO();
      const result = await service.getEmissionsNationalAggregation(
        req,
        filters,
      );
      expect(result).toEqual(expected);
    });
  });
});
