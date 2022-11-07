import { isInReportingPeriodRange } from '../utils/reporting-period-validation';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * This decorator takes in a min date and max date as a parameter
 * The date range is the min date -> max date inclusive
 */
export function IsInReportingPeriodRange(
  validationOptions?: ValidationOptions,
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isInReportingPeriodRange',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value) {
            const reportingPeriod = value.split(' Q');
            return isInReportingPeriodRange(
              reportingPeriod[0],
              reportingPeriod[1],
            );
          }
          return true;
        },
      },
    });
  };
}
