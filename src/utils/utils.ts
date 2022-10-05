export const hasArrayValues = (value: unknown): boolean => {
  return Array.isArray(value) && value.length > 0;
};

export const arrayFilterUndefinedNull = <Type>(array: Type[]): Type[] => {
  return array.filter(value => {
    return typeof value !== 'undefined' && value !== null;
  });
};

export const isUndefinedOrNull = <Type>(value: Type | Type[]): boolean => {
  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === 'undefined' || item === null) {
        return true;
      }
    }
  }

  return typeof value === 'undefined' || value === null;
};

export const objectValuesByKey = <ValueType>(
  searchKey: string,
  object: Record<string, unknown>,
  isUnique = false,
): ValueType[] => {
  const values = [];

  for (const key of Object.keys(object)) {
    if (searchKey === key) {
      values.push(object[key]);
    }

    if (object[key] && typeof object[key] === 'object') {
      values.push(
        ...objectValuesByKey<ValueType>(
          searchKey,
          object[key] as Record<string, unknown>,
        ),
      );
    }
  }

  if (isUnique) {
    return [...new Set(values)];
  }

  return values;
};
