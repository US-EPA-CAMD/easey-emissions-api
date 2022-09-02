import { faker } from '@faker-js/faker';

export const optionalValue = <ValueType>(
  value: ValueType,
  valueIfFalse: undefined | null = null,
) => {
  const isDefined = faker.datatype.boolean();

  if (isDefined) {
    return value;
  }

  return valueIfFalse;
};
