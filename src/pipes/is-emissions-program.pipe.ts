import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { DbLookupValidator } from '@us-epa-camd/easey-common/validators';

import { ProgramCode } from '../entities/program-code.entity';

/**
 * This decorator can optionally exclude programs specified in the @property param
 */
export function IsEmissionsProgram(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isProgram',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [
        {
          type: ProgramCode,
          ignoreEmpty: false,
          findOption: (args: ValidationArguments) => ({
            where: {
              programCode: args.value.toUpperCase(),
              emissionsUIFilter: 1,
            },
          }),
        },
      ],
      validator: DbLookupValidator,
    });
  };
}
