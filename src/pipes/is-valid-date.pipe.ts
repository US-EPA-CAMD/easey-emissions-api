import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isISO8601,
} from 'class-validator';

export function IsValidDate(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value) {
            return isISO8601(value, { strict: true });
          }
          return true;
        },
      },
    });
  };
}
