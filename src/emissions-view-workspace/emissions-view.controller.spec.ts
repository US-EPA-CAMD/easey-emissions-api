import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { RolesGuard } from '@us-epa-camd/easey-common/guards';
import { LoggingInterceptor } from '@us-epa-camd/easey-common/interceptors';
import { DataSource } from 'typeorm';
import { EntityManager } from 'typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import { EmissionsViewWorkspaceController } from './emissions-view.controller';
import { EmissionsViewWorkspaceRepository } from './emissions-view.repository';
import { EmissionsViewWorkspaceService } from './emissions-view.service';

describe('EmissionsViewWorkspaceController', () => {
  let emissionsViewController: EmissionsViewWorkspaceController;
  let emissionsViewService: EmissionsViewWorkspaceService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        EmissionsViewWorkspaceRepository,
        EmissionsViewWorkspaceController,
        EmissionsViewWorkspaceService,
        EntityManager,
        ConfigService,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
            getAll: jest.fn(),
            getAllAndMerge: jest.fn(),
            getAllAndOverride: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
            warn: jest.fn(),
            log: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
            setContext: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .overrideInterceptor(LoggingInterceptor)
      .useValue({
        intercept: jest.fn((context, next) => next.handle()),
      })
      .compile();

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
