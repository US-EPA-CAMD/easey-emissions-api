import { Test, TestingModule } from '@nestjs/testing';
import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import { EmissionsViewWorkspaceRepository } from './emissions-view.repository';
import { EmissionsViewWorkspaceService } from './emissions-view.service';
import * as selectedEmissionView from '../utils/selected-emission-view';

describe('EmissionsViewService', () => {
  let service: EmissionsViewWorkspaceService;
  let req: any;
  let params = new EmissionsViewParamsDTO();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmissionsViewWorkspaceService,
        EmissionsViewWorkspaceRepository,
      ],
    }).compile();

    service = module.get(EmissionsViewWorkspaceService);
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
