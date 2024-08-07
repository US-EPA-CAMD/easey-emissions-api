import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { DbLookupValidator } from '@us-epa-camd/easey-common/validators';
import { ILike } from 'typeorm';

import { UnitTypeCode } from '../entities/unit-type-code.entity';

export function IsUnitType(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsUnitType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [
        {
          type: UnitTypeCode,
          ignoreEmpty: false,
          findOption: (args: ValidationArguments) => ({
            where: {
              unitTypeDescription: ILike(args.value),
            },
          }),
        },
      ],
      validator: DbLookupValidator,
    });
  };
}
