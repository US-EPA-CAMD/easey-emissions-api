import { Test } from '@nestjs/testing';
import { EmissionsViewWorkspaceRepository } from './emissions-view.repository';
import { EmissionsViewWorkspaceController } from './emissions-view.controller';
import { EmissionsViewWorkspaceService } from './emissions-view.service';
import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

describe('EmissionsViewWorkspaceController', () => {
  let emissionsViewController: EmissionsViewWorkspaceController;
  let emissionsViewService: EmissionsViewWorkspaceService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        EmissionsViewWorkspaceRepository,
        EmissionsViewWorkspaceController,
        EmissionsViewWorkspaceService,
        ConfigService,
      ],
    }).compile();

    emissionsViewController = module.get(EmissionsViewWorkspaceController);
    emissionsViewService = module.get(EmissionsViewWorkspaceService);
  });

  it('should get available views', async function() {
    jest.spyOn(emissionsViewService, 'getView').mockResolvedValue(undefined);

    await expect(
      emissionsViewController.getView(
        'code',
        undefined,
        new EmissionsViewParamsDTO(),
      ),
    ).resolves.toEqual(undefined);
  });
});
