import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
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
            // NOTE: we will eventually want to validate by checking if the orisCode exists in DB
            value.length <= 6 &&
            value.match(/^[0-9]+$/) != null &&
            (value as number) != 0
          );
        },
      },
    });
  };
}
