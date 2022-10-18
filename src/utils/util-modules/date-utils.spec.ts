import { quarterFromMonth } from './date-utils';

describe('DateUtils', function() {
  it('should return the approriate quarter integer given a month', function() {
    expect(quarterFromMonth(1)).toEqual(4);
    expect(quarterFromMonth(3)).toEqual(4);
    expect(quarterFromMonth(4)).toEqual(1);
    expect(quarterFromMonth(6)).toEqual(1);
    expect(quarterFromMonth(7)).toEqual(2);
    expect(quarterFromMonth(9)).toEqual(2);
    expect(quarterFromMonth(10)).toEqual(3);
  });
});
