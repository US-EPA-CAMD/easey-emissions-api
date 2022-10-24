import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsInYearAndQuarterRange(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isInYearAndQuarterRange',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = args.object[relatedPropertyName];
          const date = new Date();
          const year = date.getFullYear().toString();
          const quarter = Math.floor((date.getMonth() + 3) / 3).toString();
          let currentYearValidation = true;
          if (value && relatedValue) {
            if (value.some(e => e === year)) {
              currentYearValidation = relatedValue.every(e => e <= quarter);
            }
            return (
              value.every(e => e >= 2009) &&
              value.every(e => e <= year) &&
              currentYearValidation
            );
          }
          return true;
        },
      },
    });
  };
}
