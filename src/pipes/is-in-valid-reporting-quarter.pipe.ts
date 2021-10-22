import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsInValidReportingQuarter(
  values: number[],
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsInValidReportingQuarter',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as unknown as number)[relatedPropertyName];
          const curDate = new Date();
          const curYear = new Date().getFullYear();
          const yearIndicator =
            relatedValue?.includes(curYear.toString()) &&
            relatedValue?.length === 1;

          if (curDate < new Date(`March 31, ${curYear}`) && yearIndicator) {
            return false;
          } else if (
            curDate < new Date(`June 30, ${curYear}`) &&
            yearIndicator
          ) {
            return (value as number) <= values[0];
          } else if (
            curDate < new Date(`September 30, ${curYear}`) &&
            yearIndicator
          ) {
            return (value as number) <= values[1];
          } else if (
            curDate < new Date(`December 31, ${curYear}`) &&
            yearIndicator
          ) {
            return (value as number) <= values[2];
          }
          return true;
        },
      },
    });
  };
}
