import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { getManager } from 'typeorm';

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
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const manager = getManager();

          const found = await manager.findOne(ProgramCode, {
            programCode: value.toUpperCase(),
            emissionsUIFilter: 1,
          });
          return found != null;
        },
      },
    });
  };
}
