import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsValidMonth(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidMonth',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as number)[relatedPropertyName];
          const curDate = new Date();
          const curYear = new Date().getFullYear();
          const yearIndicator =
            relatedValue.includes(curYear.toString()) &&
            relatedValue.length === 1;
          if (curDate < new Date('June 30, ' + curYear) && yearIndicator) {
            return (value as number) <= 3;
          } else if (
            curDate < new Date('September 30, ' + curYear) &&
            yearIndicator
          ) {
            return (value as number) <= 6;
          } else if (
            curDate < new Date('December 31, ' + curYear) &&
            yearIndicator
          ) {
            return (value as number) <= 9;
          }
          return true;
        },
      },
    });
  };
}
