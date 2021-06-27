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
  yearOnly: boolean,
  reportingQuarter: boolean,
  isAnnual: boolean,
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
            if (
              isAnnual &&
              (value === '1980' || value === '1985' || value === '1990')
            ) {
              return true;
            }
            const dateObject = yearOnly
              ? new Date(value as number, 0)
              : new Date(value);
            const minDate = args.constraints[0][0];
            const maxDate = args.constraints[0][1];
            const curDate = new Date();
            const curYear = new Date().getFullYear();
            if (reportingQuarter) {
              if (curDate < new Date(`March 31, ${curYear}`)) {
                return (
                  dateObject >= minDate &&
                  dateObject <= maxDate &&
                  dateObject <= new Date(`December 31, ${curYear - 1}`)
                );
              } else if (curDate < new Date(`June 30, ${curYear}`)) {
                return (
                  dateObject >= minDate &&
                  dateObject <= maxDate &&
                  dateObject <= new Date(`March 31, ${curYear}`)
                );
              } else if (curDate < new Date(`September 30, ${curYear}`)) {
                return (
                  dateObject >= minDate &&
                  dateObject <= maxDate &&
                  dateObject <= new Date(`June 30, ${curYear}`)
                );
              } else if (curDate < new Date(`December 31, ${curYear}`)) {
                return (
                  dateObject >= minDate &&
                  dateObject <= maxDate &&
                  dateObject <= new Date(`September 30, ${curYear}`)
                );
              } else {
                return (
                  dateObject >= minDate &&
                  dateObject <= maxDate &&
                  dateObject <= new Date(`December 31, ${curYear}`)
                );
              }
            }
            return dateObject >= minDate && dateObject <= maxDate;
          }
          return true;
        },
      },
    });
  };
}
