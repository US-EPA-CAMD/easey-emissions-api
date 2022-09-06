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
          if (value && relatedValue) {
            return (
              value >= 2009 &&
              (value < year || (value === year && relatedValue <= quarter))
            );
          }
          return true;
        },
      },
    });
  };
}
