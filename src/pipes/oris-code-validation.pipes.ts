import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'orisCodeValidation' })
export class OrisCodeValidation implements ValidatorConstraintInterface {
  validate(orisCode: string, args: ValidationArguments): boolean {
    return orisCode.length <= 6 && orisCode.match(/^[1-9][0-9]+$/) != null;
  }

  defaultMessage(args: ValidationArguments) {
    return 'ORIS code not valid. Refer to the list of available ORIS codes for valid values [placeholder for link to Facilities endpoint]';
  }
}
