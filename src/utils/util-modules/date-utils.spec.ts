import { quarterFromMonth } from './date-utils';

describe('DateUtils', function() {
  it('should return the appropriate quarter integer given a month', function() {
    const monthArrays = [
      ['Jan.', 'Feb.', 'Mar.'],
      ['Apr.', 'May', 'Jun.'],
      ['Jul.', 'Aug.', 'Sep'],
      ['Oct.', 'Nov.', 'Dec'],
    ];

    for (const [index, monthArray] of monthArrays.entries()) {
      for (const month of monthArray) {
        const quarter = index + 1;
        expect(
          quarterFromMonth(new Date(`${month}. 1, 2022`).getMonth()),
        ).toEqual(quarter);
      }
    }
  });
});
