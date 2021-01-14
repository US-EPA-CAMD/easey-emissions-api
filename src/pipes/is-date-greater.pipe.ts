import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * This decorator takes in a date property - in the same object - as a parameter
 */
export function IsDateGreaterThanEqualTo(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateGreaterThanEqualTo',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as Date)[relatedPropertyName];
          if (value && relatedValue) {
            return (value as Date) >= relatedValue;
          }
          return true;
        },
      },
    });
  };
}
