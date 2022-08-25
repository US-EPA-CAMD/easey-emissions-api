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
