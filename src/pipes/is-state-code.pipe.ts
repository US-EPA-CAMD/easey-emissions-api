import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { DbLookupValidator } from '@us-epa-camd/easey-common/validators';

import { StateCode } from '../entities/state-code.entity';

export function IsStateCode(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStateCode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [
        {
          type: StateCode,
          ignoreEmpty: false,
          findOption: (args: ValidationArguments) => ({
            where: {
              stateCode: args.value.toUpperCase(),
            },
          }),
        },
      ],
      validator: DbLookupValidator,
    });
  };
}
