import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, EntityManager } from 'typeorm';

import { EmissionsViewDTO } from '../dto/emissions-view.dto';
import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import * as selectedEmissionView from '../utils/selected-emission-view';
import { EmissionsViewRepository } from './emissions-view.repository';
import { EmissionsViewService } from './emissions-view.service';

// Mock the withSlaveConnection function
jest.mock('@us-epa-camd/easey-common', () => ({
  withSlaveConnection: jest.fn().mockImplementation((dataSource, callback) => {
    const mockEntityManager = {
      getRepository: jest.fn().mockReturnValue({
        find: jest.fn().mockResolvedValue([]),
      }),
      query: jest.fn().mockResolvedValue([]),
    };
    return callback(mockEntityManager);
  }),
}));

const mockRepository = {
  find: jest.fn(),
  query: jest.fn(),
  target: 'mock-target',
};

describe('EmissionsViewService', () => {
  let service: EmissionsViewService;
  let repository: any;
  let req: any;
  let params = new EmissionsViewParamsDTO();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmissionsViewService,
        EmissionsViewRepository,
        EntityManager,
        {
          provide: EmissionsViewRepository,
          useValue: mockRepository,
        },
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
        }
      ],
    }).compile();

    service = module.get(EmissionsViewService);
    repository = module.get(EmissionsViewRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return list of views', async () => {
    const expectedResult: EmissionsViewDTO[] = [];
    repository.find.mockResolvedValue(expectedResult);
    const result = await service.getAvailableViews();
    expect(result).toEqual(expectedResult);
  });

  it('should return selected view data', async () => {
    const mockSelectedView = jest
      .spyOn(selectedEmissionView, 'getSelectedView')
      .mockResolvedValue(null);
    repository.query.mockResolvedValue([]);

    const result = await service.getView('dailyCal', req, params);
    expect(result).toEqual(null);
    expect(mockSelectedView).toHaveBeenCalled();
  });
});
