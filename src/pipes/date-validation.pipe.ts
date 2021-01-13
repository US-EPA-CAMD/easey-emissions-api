// import {
//   ValidatorConstraint,
//   ValidatorConstraintInterface,
//   ValidationArguments,
//   isISO8601,
// } from 'class-validator';

// @ValidatorConstraint({ name: 'dateValidation' })
// export class DateValidation implements ValidatorConstraintInterface {
//   validate(date: Date, args: ValidationArguments): boolean {
//     const dateObject = new Date(date);
//     const minDate = new Date('1995-01-01');
//     const currentYear = new Date().getUTCFullYear();

//     return (
//       date != undefined &&
//       isISO8601(date, { strict: true }) &&
//       String(date).match(/^\d{4}-\d{2}-\d{2}$/) != null &&
//       dateObject >= minDate &&
//       dateObject.getUTCFullYear() <= currentYear
//     );
//   }

//   defaultMessage(args: ValidationArguments) {
//     if (!args.value) {
//       return 'Please enter a $property';
//     } else if (args.value.match(/^\d{4}-\d{2}-\d{2}$/) === null) {
//       return 'Please enter the $property in the YYYY-MM-DD format';
//     } else if (!isISO8601(args.value, { strict: true })) {
//       return 'Please enter a valid $property in the YYYY-MM-DD format';
//     } else {
//       return 'Please enter a $property year between 1995 and this year';
//     }
//   }
// }
