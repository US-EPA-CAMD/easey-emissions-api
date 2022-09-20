import { isUndefinedOrNull, objectValuesByKey } from './utils';

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

  describe('objectValuesByKey', () => {
    it('should return an empty array if no values for key is found', function() {
      const object = { findMe: '123', notMe: 234 };

      expect(objectValuesByKey('notFound', object));
    });

    it('should return an array with a value given a key for a shallow object', function() {
      const object = { findMe: '123', notMe: 234 };

      expect(objectValuesByKey('findMe', object)).toEqual(['123']);
    });

    it('should return an array of values give a key for a deep object', function() {
      const object = {
        findMe: '123',
        notMe: 234,
        nested: {
          findMe: '123',
          hello: 'there',
          nestedNested: {
            findMe: '235',
          },
        },
      };

      const results = objectValuesByKey('findMe', object);
      const uniqueResults = objectValuesByKey('findMe', object, true);

      expect(results.length).toEqual(3);
      expect(results).toEqual(['123', '123', '235']);
      expect(uniqueResults.length).toEqual(2);
      expect(uniqueResults).toEqual(['123', '235']);
    });
  });
});
