import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isNumberString,
} from 'class-validator';

export function IsYearFormat(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsYearFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value) {
            return (
              isNumberString(value, { no_symbols: true }) && value.length === 4
            );
          }
          return true;
        },
      },
    });
  };
}
