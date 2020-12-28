import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'orisCodeValidation' })
export class OrisCodeValidation implements ValidatorConstraintInterface {
  validate(orisCode: number, args: ValidationArguments): boolean {
    return (
      String(orisCode).length <= 6 &&
      typeof orisCode === 'number' &&
      orisCode % 1 === 0 &&
      orisCode >= 0
    );
  }

  defaultMessage(args: ValidationArguments) {
    return 'ORIS code not valid. Refer to the list of available ORIS codes for valid values [placeholder for link to Facilities endpoint]';
  }
}
