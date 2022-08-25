import { isUndefinedOrNull } from './utils';

describe('Utils', () => {
  describe('isUndefinedOrNull', () => {
    it('should return false for defined or non null value', function() {
      expect(isUndefinedOrNull(0)).toBe(false);
      expect(isUndefinedOrNull('')).toBe(false);
      expect(isUndefinedOrNull(NaN)).toBe(false);
    });

    it('should return true for a undefined or null value', function() {
      expect(isUndefinedOrNull(undefined)).toBe(true);
      expect(isUndefinedOrNull(null)).toBe(true);
    });

    it('should return true is one item in an array is undefined or null', function() {
      expect(isUndefinedOrNull(['123', 123, undefined])).toBe(true);
      expect(isUndefinedOrNull(['123', 123, null])).toBe(true);
    });

    it('should return false is no items in an array are undefined or null', function() {
      expect(isUndefinedOrNull(['123', 123])).toBe(false);
    });
  });
});
