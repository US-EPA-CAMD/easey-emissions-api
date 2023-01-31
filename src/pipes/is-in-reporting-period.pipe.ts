import { isInReportingPeriodRange } from '../utils/reporting-period-validation';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

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
