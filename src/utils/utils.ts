import { EntityManager, Repository } from 'typeorm';

export * from './util-modules/date-utils';

export const hasArrayValues = (value: unknown): boolean => {
  return Array.isArray(value) && value.length > 0;
};

export const arrayFilterUndefinedNull = <Type>(array: Type[]): Type[] => {
  return array.filter(value => {
    return typeof value !== 'undefined' && value !== null;
  });
};

export const arrayPushCreate = <SourceType>(
  source: Array<SourceType> | undefined,
  values: SourceType[] | undefined,
) => {
  if (!hasArrayValues(values)) {
    return source;
  }

  if (!hasArrayValues(source)) {
    return values;
  }

  return [...source, ...values];
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
  object: unknown,
  isUnique = false,
): ValueType[] => {
  const values = [];

  for (const key of Object.keys(object)) {
    if (searchKey === key) {
      values.push(object[key]);
    }

    if (object[key] && typeof object[key] === 'object') {
      values.push(...objectValuesByKey<ValueType>(searchKey, object[key]));
    }
  }

  if (isUnique) {
    return [...new Set(values)];
  }

  return values;
};

export const splitArrayInChunks = <T>(
  inputArray: T[],
  perChunk = 1000,
): T[][] => {
  const result = inputArray.reduce<T[][]>((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  return result;
};

export function withTransaction<E, T extends Repository<E>>(
  repository: T,
  trx?: EntityManager,
) {
  if (!trx) return repository;

  const repositoryConstructor = repository.constructor as {
    new (manager: EntityManager): T;
  };

  const { target, manager, queryRunner, ...otherRepositoryProperties } =
    repository;

  return Object.assign(new repositoryConstructor(trx), {
    ...otherRepositoryProperties,
  });
}