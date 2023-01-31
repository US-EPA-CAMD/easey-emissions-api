import { isInReportingPeriodRange } from '../utils/reporting-period-validation';
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
          if (value && relatedValue) {
            return isInReportingPeriodRange(value, relatedValue);
          }
          return true;
        },
      },
    });
  };
}
