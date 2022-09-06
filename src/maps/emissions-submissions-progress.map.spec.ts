import { EmissionsSubmissionsProgressMap } from './emissions-submissions-progress.map';
import { genEmissionsSubmissionsProgress } from '../../test/object-generators/emissions-submissions-progress';
import { EmissionsSubmissionsProgress } from '../entities/vw-emissions-submissions-progress.entity';

describe('EmissionsSubmissionsProgressMap', () => {
  let map: EmissionsSubmissionsProgressMap;

  beforeAll(() => {
    map = new EmissionsSubmissionsProgressMap();
  });

  it('should map values correctly', async function() {
    const emissionProgress = genEmissionsSubmissionsProgress<
      EmissionsSubmissionsProgress
    >(3);

    for (const progress of emissionProgress) {
      let quarterN;
      switch (progress.quarter) {
        case 1:
          quarterN = 'First';
          break;
        case 2:
          quarterN = 'Second';
          break;
        case 3:
          quarterN = 'Third';
          break;
        default:
          quarterN = 'Fourth';
      }

      await expect(map.one(progress)).resolves.toEqual({
        year: progress.calendarYear,
        quarterName: quarterN,
        quarter: progress.quarter,
        percentage: progress.submittedPercentage,
      });
    }
  });
});
