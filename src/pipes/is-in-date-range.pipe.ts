import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * This decorator takes in a min date and max date as a parameter
 * The date range is the min date -> max date inclusive
 */
export function IsInDateRange(
  property: Date[],
  validationOptions?: ValidationOptions,
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isInDateRange',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value) {
            const dateObject = new Date(value);
            const minDate = args.constraints[0][0];
            const currentDate = args.constraints[0][1];

            return (
              dateObject >= minDate &&
              dateObject <= currentDate
            );
          }
          return true;
        },
      },
    });
  };
}
