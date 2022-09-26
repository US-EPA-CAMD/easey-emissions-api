import { Test } from '@nestjs/testing';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { MatsDerivedHourlyValueWorkspaceService } from './mats-derived-hourly-value.service';
import { MatsDerivedHourlyValueWorkspaceRepository } from './mats-derived-hourly-value.repository';
import { genMatsDerivedHourlyValueImportDto } from '../../test/object-generators/mats-derived-hourly-value-dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';

const mockRepository = {
  export: () => null,
  save: () => null,
  create:() => null,
  find: () => null,
};
const mockMap = {
  many: () => null,
};

describe('MatsDerivedHourlyValueWorkspaceService', () => {
  let service: MatsDerivedHourlyValueWorkspaceService;
  let repository: any;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MatsDerivedHourlyValueWorkspaceService,
        {
          provide: MatsDerivedHourlyValueMap,
          useValue: mockMap,
        },
        {
          provide: MatsDerivedHourlyValueWorkspaceRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(MatsDerivedHourlyValueWorkspaceService);
    repository = module.get(MatsDerivedHourlyValueWorkspaceRepository);
    map = module.get(MatsDerivedHourlyValueMap);
  });

  describe('MATS Derived Hourly Value Export', () => {
    it('service should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should export a mats derived hourly value record', async () => {
      const result = await service.export(['123']);
      expect(result).toEqual(null);
    });
  });

  describe('MATS Derived Hourly Value Import', () =>{
    it( 'should import a mats derived hourly value record', async()=>{
      const generatedData = genMatsDerivedHourlyValueImportDto()[0]
      const identitifiers: ImportIdentifiers= {components:{}, monitorFormulas:{}, monitoringSystems:{}}
      const r = await service.import(generatedData, identitifiers, "", "0", 1 )
      expect(r).toBeNull();
    })

  })
});
