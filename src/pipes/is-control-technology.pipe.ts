import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { ILike } from 'typeorm';
import { DbLookupValidator } from '@us-epa-camd/easey-common/validators';

import { ControlCode } from '../entities/control-code.entity';

export function IsControlTechnology(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isControlTechnology',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [
        {
          type: ControlCode,
          ignoreEmpty: false,
          findOption: (args: ValidationArguments) => ({
            where: {
              controlDescription: ILike(args.value),
            },
          }),
        },
      ],
      validator: DbLookupValidator,
    });
  };
}
