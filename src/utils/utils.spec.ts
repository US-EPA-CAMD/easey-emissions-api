import {
  arrayFilterUndefinedNull,
  arrayPushCreate,
  hasArrayValues,
  isUndefinedOrNull,
  objectValuesByKey,
} from './utils';
import { faker } from '@faker-js/faker';

describe('Utils', () => {
  describe('arrayFilterUndefinedNull', () => {
    it('should return a filtered array', function() {
      expect(arrayFilterUndefinedNull([1, 3, undefined, null])).toEqual([1, 3]);
      expect(arrayFilterUndefinedNull([])).toEqual([]);
    });
  });

  describe('arrayPushCreate', () => {
    const newArray = faker.helpers.uniqueArray(faker.datatype.string, 3);
    it('should new array if source is undefined or empty', function() {
      expect(arrayPushCreate(undefined, newArray)).toEqual(newArray);
      expect(arrayPushCreate([], newArray)).toEqual(newArray);
    });

    it('should return the source if values are empty or undefined', function() {
      expect(arrayPushCreate(undefined, undefined)).toEqual(undefined);
      expect(arrayPushCreate(undefined, [])).toEqual(undefined);
      expect(arrayPushCreate([], undefined)).toEqual([]);
      expect(arrayPushCreate([], [])).toEqual([]);
    });

    it('should return the appended array if source and new array have values', function() {
      expect(arrayPushCreate(newArray, newArray)).toEqual([
        ...newArray,
        ...newArray,
      ]);
    });
  });

  describe('hasArrayValues', () => {
    it('should return true if array has at least one value', function() {
      expect(hasArrayValues([1])).toBe(true);
      expect(hasArrayValues([{}])).toBe(true);
      expect(hasArrayValues([undefined])).toBe(true);
      expect(hasArrayValues([null])).toBe(true);
    });

    it('should return false if the value is not array or if the array is empty', function() {
      expect(hasArrayValues([])).toBe(false);
      expect(hasArrayValues(undefined)).toBe(false);
      expect(hasArrayValues(null)).toBe(false);
      expect(hasArrayValues("I'm not an array.")).toBe(false);
    });
  });

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

      expect(objectValuesByKey('notFound', object)).toEqual([]);
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
