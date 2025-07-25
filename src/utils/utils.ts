export * from './util-modules/date-utils';
import { EntityManager, Repository } from 'typeorm';

/**
 * Creates a new repository instance that operates within a transaction context.
 * If no transaction is provided, returns the original repository unchanged.
 *
 * @param repository - The original repository instance
 * @param trx - Optional transaction entity manager
 * @returns A repository instance that operates within the transaction context
 */
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

  // Create a new instance using the constructor
  const newRepo = new repositoryConstructor(trx);

  // Create a plain object with the expected structure
  // Use type assertion to access properties that might not be in the type definition
  return {
    id: (newRepo as any).id,
    ...otherRepositoryProperties
  } as unknown as T;
}

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

export const splitArrayInChunks = (inputArray, perChunk = 1000) => {
  const result = inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  return result;
};
