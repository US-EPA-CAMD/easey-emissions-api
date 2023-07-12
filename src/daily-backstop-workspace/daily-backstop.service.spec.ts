import { Test } from '@nestjs/testing';
import { BulkLoadService } from "@us-epa-camd/easey-common/bulk-load";
import { DailyBackstopWorkspaceService } from "./daily-backstop.service";
import { ConfigService } from '@nestjs/config';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { genDailyBackstopImportDto } from '../../test/object-generators/daily-backstop-dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';


describe('Daily Backstop Workspace Service Test', () => {
    let service: DailyBackstopWorkspaceService;
    let bulkLoadService: BulkLoadService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                DailyBackstopWorkspaceService,
                BulkLoadService,
                ConfigService,
            ],
        }).compile();

        service = module.get(DailyBackstopWorkspaceService);
        bulkLoadService = module.get(BulkLoadService);
    });

    describe('Daily Backstop Import', () => {
        it('should successfully import a daily record', async () => {
            const generatedData = genDailyBackstopImportDto(1);

            // @ts-expect-error use as mock
            jest.spyOn(bulkLoadService, 'startBulkLoader').mockResolvedValue({
                writeObject: jest.fn(),
                complete: jest.fn(),
                finished: Promise.resolve(true),
            });

            const emissionsDto = new EmissionsImportDTO();
            emissionsDto.dailyBackstopData = generatedData;

            const locations = [{ unit: { name: 'a' }, id: 1 }];
            emissionsDto.dailyBackstopData[0].unitId = 'a';
            const identifiers = ({
                components: [],
                monitorFormulas: [],
                monitoringSystems: [],
                userId: '',
            } as unknown) as ImportIdentifiers;

            await expect(service.import(emissionsDto, locations, '', identifiers, ''))
                .resolves;
        });
    });


});
