import { EmissionsViewService } from './emissions-view.service';
import { EmissionsViewRepository } from './emissions-view.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import { getManager } from 'typeorm';
import * as selectedEmissionView from '../utils/selected-emission-view';

describe('EmissionsViewService', () => {
  let service: EmissionsViewService;
  let req: any;
  let params = new EmissionsViewParamsDTO();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmissionsViewService,
        EmissionsViewRepository,
        {
          provide: getManager,
          useFactory: jest.fn(),
        },
      ],
    }).compile();

    service = module.get<EmissionsViewService>(EmissionsViewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return selected view data', async () => {
    const mockSelectedView = jest
      .spyOn(selectedEmissionView, 'getSelectedView')
      .mockReturnValueOnce(null);
    const result = await service.getView('dailyCal', req, params);
    expect(result).toEqual(null);
    expect(mockSelectedView).toHaveBeenCalled();
  });
});
