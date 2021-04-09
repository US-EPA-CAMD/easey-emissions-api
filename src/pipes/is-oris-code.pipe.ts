import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isNumberString,
} from 'class-validator';

export function IsOrisCode(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isOrisCode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return (
            isNumberString(value, { no_symbols: true }) &&
            value.length <= 6 &&
            (value as number) != 0
          );
        },
      },
    });
  };
}
